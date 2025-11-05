import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MultidisciplinaryService } from './multidisciplinary.service';
import { MultidisciplinarySchedule } from './entities/multidisciplinary-schedule.entity';
import { GeneratedMultidisciplinaryNote } from './entities/generated-multidisciplinary-note.entity';
import { Patient } from '../patients/entities/patient.entity';
import { WordMultidisciplinaryTemplateService } from './templates/word-multidisciplinary-template.service';

describe('MultidisciplinaryService', () => {
  let service: MultidisciplinaryService;
  let scheduleRepository: Repository<MultidisciplinarySchedule>;
  let noteRepository: Repository<GeneratedMultidisciplinaryNote>;
  let patientRepository: Repository<Patient>;
  let wordTemplateService: WordMultidisciplinaryTemplateService;

  const mockScheduleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
  };

  const mockNoteRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockPatientRepository = {
    findOne: jest.fn(),
  };

  const mockWordTemplateService = {
    generateNote: jest.fn(),
    generateFileName: jest.fn(),
    saveDocument: jest.fn(),
  };

  const mockPatient = {
    id: 'patient-123',
    patientNumber: 'P001',
    firstName: 'John',
    lastName: 'Doe',
    admissionDate: new Date('2025-01-01'),
    clinicId: 'clinic-123',
  };

  const mockSchedule = {
    id: 'schedule-123',
    patientId: 'patient-123',
    reviewNumber: 1,
    scheduledDate: new Date('2025-02-01'),
    isCompleted: false,
    patient: mockPatient,
  };

  const mockParticipants = [
    { name: 'Dr. Smith', role: 'Psychiatrist', signature: 'Dr. Smith, MD' },
    { name: 'Jane Doe', role: 'Therapist', signature: 'Jane Doe, LCSW' },
    { name: 'Bob Johnson', role: 'Nurse', signature: 'Bob Johnson, RN' },
  ];

  const generateNoteDto = {
    participants: mockParticipants,
    caseSummary: 'Patient showing improvement in social skills',
    currentStatus: 'Stable and engaged in treatment',
    teamDiscussion: 'Team discussed progress and next steps',
    recommendations: 'Continue current treatment plan',
    actionPlan: 'Increase group therapy sessions',
    followUpPlan: 'Schedule follow-up in 2 weeks',
    nextMeetingDate: new Date('2025-03-01'),
  };

  const scheduleDto = {
    patientId: 'patient-123',
    mtprScheduleId: 'mtpr-schedule-123',
    scheduledDate: new Date('2025-02-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MultidisciplinaryService,
        {
          provide: getRepositoryToken(MultidisciplinarySchedule),
          useValue: mockScheduleRepository,
        },
        {
          provide: getRepositoryToken(GeneratedMultidisciplinaryNote),
          useValue: mockNoteRepository,
        },
        {
          provide: getRepositoryToken(Patient),
          useValue: mockPatientRepository,
        },
        {
          provide: WordMultidisciplinaryTemplateService,
          useValue: mockWordTemplateService,
        },
      ],
    }).compile();

    service = module.get<MultidisciplinaryService>(MultidisciplinaryService);
    scheduleRepository = module.get<Repository<MultidisciplinarySchedule>>(
      getRepositoryToken(MultidisciplinarySchedule),
    );
    noteRepository = module.get<Repository<GeneratedMultidisciplinaryNote>>(
      getRepositoryToken(GeneratedMultidisciplinaryNote),
    );
    patientRepository = module.get<Repository<Patient>>(
      getRepositoryToken(Patient),
    );
    wordTemplateService = module.get<WordMultidisciplinaryTemplateService>(
      WordMultidisciplinaryTemplateService,
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scheduleMultidisciplinary', () => {
    it('should create a multidisciplinary schedule successfully', async () => {
      mockPatientRepository.findOne.mockResolvedValue(mockPatient);
      mockScheduleRepository.count.mockResolvedValue(0);

      const expectedSchedule = {
        id: 'schedule-123',
        patientId: 'patient-123',
        reviewNumber: 1,
        scheduledDate: scheduleDto.scheduledDate,
      };
      mockScheduleRepository.create.mockReturnValue(expectedSchedule);
      mockScheduleRepository.save.mockResolvedValue(expectedSchedule);

      const result = await service.scheduleMultidisciplinary(scheduleDto);

      expect(result).toBeDefined();
      expect(mockPatientRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'patient-123' },
      });
      expect(mockScheduleRepository.count).toHaveBeenCalledWith({
        where: { patientId: 'patient-123' },
      });
      expect(mockScheduleRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when patient does not exist', async () => {
      mockPatientRepository.findOne.mockResolvedValue(null);

      await expect(service.scheduleMultidisciplinary(scheduleDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should auto-increment review number based on existing schedules', async () => {
      mockPatientRepository.findOne.mockResolvedValue(mockPatient);
      mockScheduleRepository.count.mockResolvedValue(3); // 3 existing schedules

      const expectedSchedule = {
        id: 'schedule-123',
        patientId: 'patient-123',
        reviewNumber: 4, // Should be 3 + 1
        scheduledDate: scheduleDto.scheduledDate,
      };
      mockScheduleRepository.create.mockReturnValue(expectedSchedule);
      mockScheduleRepository.save.mockResolvedValue(expectedSchedule);

      const result = await service.scheduleMultidisciplinary(scheduleDto);

      expect(mockScheduleRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ reviewNumber: 4 }),
      );
    });
  });

  describe('generateNote', () => {
    it('should generate multidisciplinary note successfully', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(mockSchedule);

      const mockNote = {
        id: 'note-123',
        ...generateNoteDto,
        patientId: 'patient-123',
        scheduleId: 'schedule-123',
      };
      mockNoteRepository.create.mockReturnValue(mockNote);
      mockNoteRepository.save.mockResolvedValue(mockNote);
      mockNoteRepository.findOne.mockResolvedValue({
        ...mockNote,
        patient: mockPatient,
        schedule: mockSchedule,
      });

      mockWordTemplateService.generateNote.mockResolvedValue(Buffer.from('test'));
      mockWordTemplateService.generateFileName.mockReturnValue('multidisciplinary_test.docx');
      mockWordTemplateService.saveDocument.mockResolvedValue('/path/to/multidisciplinary_test.docx');

      const result = await service.generateNote('schedule-123', generateNoteDto, 'user-123');

      expect(result).toBeDefined();
      expect(mockScheduleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'schedule-123' },
        relations: ['patient'],
      });
      expect(mockNoteRepository.save).toHaveBeenCalled();
      expect(mockScheduleRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ isCompleted: true }),
      );
    });

    it('should throw NotFoundException when schedule does not exist', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(null);

      await expect(
        service.generateNote('nonexistent', generateNoteDto, 'user-123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when schedule is already completed', async () => {
      const completedSchedule = { ...mockSchedule, isCompleted: true };
      mockScheduleRepository.findOne.mockResolvedValue(completedSchedule);

      await expect(
        service.generateNote('schedule-123', generateNoteDto, 'user-123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when less than 2 participants', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(mockSchedule);

      const invalidDto = {
        ...generateNoteDto,
        participants: [{ name: 'Dr. Smith', role: 'Psychiatrist' }],
      };

      await expect(service.generateNote('schedule-123', invalidDto, 'user-123')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when no participants provided', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(mockSchedule);

      const invalidDto = {
        ...generateNoteDto,
        participants: [],
      };

      await expect(service.generateNote('schedule-123', invalidDto, 'user-123')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getSchedulesByPatient', () => {
    it('should return all schedules for a patient', async () => {
      const mockSchedules = [
        { id: 'schedule-1', patientId: 'patient-123', reviewNumber: 1 },
        { id: 'schedule-2', patientId: 'patient-123', reviewNumber: 2 },
      ];
      mockScheduleRepository.find.mockResolvedValue(mockSchedules);

      const result = await service.getSchedulesByPatient('patient-123');

      expect(result).toHaveLength(2);
      expect(mockScheduleRepository.find).toHaveBeenCalledWith({
        where: { patientId: 'patient-123' },
        relations: ['patient', 'generatedNote'],
        order: { scheduledDate: 'ASC' },
      });
    });
  });

  describe('getSchedule', () => {
    it('should return a schedule by id', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(mockSchedule);

      const result = await service.getSchedule('schedule-123');

      expect(result).toEqual(mockSchedule);
      expect(mockScheduleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'schedule-123' },
        relations: ['patient', 'generatedNote'],
      });
    });

    it('should throw NotFoundException when schedule is not found', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(null);

      await expect(service.getSchedule('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getNotesByPatient', () => {
    it('should return all notes for a patient', async () => {
      const mockNotes = [
        { id: 'note-1', patientId: 'patient-123', reviewNumber: 1 },
        { id: 'note-2', patientId: 'patient-123', reviewNumber: 2 },
      ];
      mockNoteRepository.find.mockResolvedValue(mockNotes);

      const result = await service.getNotesByPatient('patient-123');

      expect(result).toHaveLength(2);
      expect(mockNoteRepository.find).toHaveBeenCalledWith({
        where: { patientId: 'patient-123' },
        relations: ['patient', 'schedule'],
        order: { meetingDate: 'DESC' },
      });
    });
  });

  describe('getNote', () => {
    it('should return a note by id', async () => {
      const mockNote = { id: 'note-123', patientId: 'patient-123' };
      mockNoteRepository.findOne.mockResolvedValue(mockNote);

      const result = await service.getNote('note-123');

      expect(result).toEqual(mockNote);
      expect(mockNoteRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'note-123' },
        relations: ['patient', 'schedule', 'generatedBy'],
      });
    });

    it('should throw NotFoundException when note is not found', async () => {
      mockNoteRepository.findOne.mockResolvedValue(null);

      await expect(service.getNote('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
