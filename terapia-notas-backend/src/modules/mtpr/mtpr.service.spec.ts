import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MtprService } from './mtpr.service';
import { MtprSchedule } from './entities/mtpr-schedule.entity';
import { GeneratedMtpr } from './entities/generated-mtpr.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { PatientGoal } from '../patients/entities/patient-goal.entity';
import { WordMtprTemplateService } from './templates/word-mtpr-template.service';

describe('MtprService', () => {
  let service: MtprService;
  let scheduleRepository: Repository<MtprSchedule>;
  let mtprRepository: Repository<GeneratedMtpr>;
  let patientRepository: Repository<Patient>;
  let attendanceRepository: Repository<Attendance>;
  let goalRepository: Repository<PatientGoal>;
  let wordTemplateService: WordMtprTemplateService;

  const mockScheduleRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockMtprRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockPatientRepository = {
    findOne: jest.fn(),
  };

  const mockAttendanceRepository = {
    find: jest.fn(),
  };

  const mockGoalRepository = {
    find: jest.fn(),
  };

  const mockWordTemplateService = {
    generateMtpr: jest.fn(),
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
    scheduledDate: new Date('2025-04-01'),
    isCompleted: false,
    patient: mockPatient,
  };

  const mockGoals = [
    { id: 'goal-1', patientId: 'patient-123', goalNumber: 1, goalText: 'Goal 1' },
    { id: 'goal-2', patientId: 'patient-123', goalNumber: 2, goalText: 'Goal 2' },
    { id: 'goal-3', patientId: 'patient-123', goalNumber: 3, goalText: 'Goal 3' },
    { id: 'goal-4', patientId: 'patient-123', goalNumber: 4, goalText: 'Goal 4' },
  ];

  const mockAttendance = [
    { id: '1', patientId: 'patient-123', attendanceDate: new Date('2025-01-06'), status: 'P' },
    { id: '2', patientId: 'patient-123', attendanceDate: new Date('2025-01-07'), status: 'P' },
    { id: '3', patientId: 'patient-123', attendanceDate: new Date('2025-01-08'), status: 'P' },
    { id: '4', patientId: 'patient-123', attendanceDate: new Date('2025-01-09'), status: 'P' },
    { id: '5', patientId: 'patient-123', attendanceDate: new Date('2025-01-10'), status: 'P' },
    { id: '6', patientId: 'patient-123', attendanceDate: new Date('2025-01-13'), status: 'A' },
    { id: '7', patientId: 'patient-123', attendanceDate: new Date('2025-01-14'), status: 'P' },
    { id: '8', patientId: 'patient-123', attendanceDate: new Date('2025-01-15'), status: 'P' },
    { id: '9', patientId: 'patient-123', attendanceDate: new Date('2025-01-16'), status: 'P' },
    { id: '10', patientId: 'patient-123', attendanceDate: new Date('2025-01-17'), status: 'P' },
  ];

  const generateMtprDto = {
    mentalStatus: 'Alert and oriented x3',
    currentMedications: [
      { name: 'Sertraline', dosage: '50mg', frequency: 'Daily' },
      { name: 'Lorazepam', dosage: '1mg', frequency: 'PRN' },
    ],
    treatmentInterventions: 'CBT and group therapy',
    goal1Progress: 'Good progress on goal 1',
    goal2Progress: 'Moderate progress on goal 2',
    goal3Progress: 'Significant improvement on goal 3',
    goal4Progress: 'Working towards goal 4',
    barriers: 'Transportation issues',
    planNextPeriod: 'Continue current treatment plan',
    dischargePlanning: 'Target discharge in 60 days',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MtprService,
        {
          provide: getRepositoryToken(MtprSchedule),
          useValue: mockScheduleRepository,
        },
        {
          provide: getRepositoryToken(GeneratedMtpr),
          useValue: mockMtprRepository,
        },
        {
          provide: getRepositoryToken(Patient),
          useValue: mockPatientRepository,
        },
        {
          provide: getRepositoryToken(Attendance),
          useValue: mockAttendanceRepository,
        },
        {
          provide: getRepositoryToken(PatientGoal),
          useValue: mockGoalRepository,
        },
        {
          provide: WordMtprTemplateService,
          useValue: mockWordTemplateService,
        },
      ],
    }).compile();

    service = module.get<MtprService>(MtprService);
    scheduleRepository = module.get<Repository<MtprSchedule>>(
      getRepositoryToken(MtprSchedule),
    );
    mtprRepository = module.get<Repository<GeneratedMtpr>>(
      getRepositoryToken(GeneratedMtpr),
    );
    patientRepository = module.get<Repository<Patient>>(
      getRepositoryToken(Patient),
    );
    attendanceRepository = module.get<Repository<Attendance>>(
      getRepositoryToken(Attendance),
    );
    goalRepository = module.get<Repository<PatientGoal>>(
      getRepositoryToken(PatientGoal),
    );
    wordTemplateService = module.get<WordMtprTemplateService>(WordMtprTemplateService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateMtpr', () => {
    it('should generate MTPR successfully', async () => {
      // Setup mocks
      mockScheduleRepository.findOne.mockResolvedValue(mockSchedule);
      mockAttendanceRepository.find.mockResolvedValue(mockAttendance);
      mockGoalRepository.find.mockResolvedValue(mockGoals);

      const mockMtpr = {
        id: 'mtpr-123',
        ...generateMtprDto,
        patientId: 'patient-123',
        scheduleId: 'schedule-123',
        reviewNumber: 1,
        attendancePercentage: 90,
      };
      mockMtprRepository.create.mockReturnValue(mockMtpr);
      mockMtprRepository.save.mockResolvedValue(mockMtpr);
      mockMtprRepository.findOne.mockResolvedValue({
        ...mockMtpr,
        patient: mockPatient,
        schedule: mockSchedule,
      });

      mockWordTemplateService.generateMtpr.mockResolvedValue(Buffer.from('test'));
      mockWordTemplateService.generateFileName.mockReturnValue('mtpr_test.docx');
      mockWordTemplateService.saveDocument.mockResolvedValue('/path/to/mtpr_test.docx');

      // Execute
      const result = await service.generateMtpr('schedule-123', generateMtprDto, 'user-123');

      // Assert
      expect(result).toBeDefined();
      expect(mockScheduleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'schedule-123' },
        relations: ['patient'],
      });
      expect(mockGoalRepository.find).toHaveBeenCalled();
      expect(mockMtprRepository.save).toHaveBeenCalled();
      expect(mockScheduleRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ isCompleted: true }),
      );
    });

    it('should throw NotFoundException when schedule does not exist', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(null);

      await expect(
        service.generateMtpr('nonexistent', generateMtprDto, 'user-123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when schedule is already completed', async () => {
      const completedSchedule = { ...mockSchedule, isCompleted: true };
      mockScheduleRepository.findOne.mockResolvedValue(completedSchedule);

      await expect(
        service.generateMtpr('schedule-123', generateMtprDto, 'user-123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when less than 10 days since admission', async () => {
      const recentAdmission = {
        ...mockSchedule,
        patient: {
          ...mockPatient,
          admissionDate: new Date(), // Today
        },
      };
      mockScheduleRepository.findOne.mockResolvedValue(recentAdmission);

      await expect(
        service.generateMtpr('schedule-123', generateMtprDto, 'user-123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when attendance is less than 50%', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(mockSchedule);

      // Mock low attendance (only 2 out of 10 days present)
      const lowAttendance = [
        { id: '1', patientId: 'patient-123', attendanceDate: new Date('2025-01-06'), status: 'P' },
        { id: '2', patientId: 'patient-123', attendanceDate: new Date('2025-01-07'), status: 'A' },
        { id: '3', patientId: 'patient-123', attendanceDate: new Date('2025-01-08'), status: 'A' },
        { id: '4', patientId: 'patient-123', attendanceDate: new Date('2025-01-09'), status: 'A' },
        { id: '5', patientId: 'patient-123', attendanceDate: new Date('2025-01-10'), status: 'A' },
        { id: '6', patientId: 'patient-123', attendanceDate: new Date('2025-01-13'), status: 'A' },
        { id: '7', patientId: 'patient-123', attendanceDate: new Date('2025-01-14'), status: 'A' },
        { id: '8', patientId: 'patient-123', attendanceDate: new Date('2025-01-15'), status: 'A' },
        { id: '9', patientId: 'patient-123', attendanceDate: new Date('2025-01-16'), status: 'A' },
        { id: '10', patientId: 'patient-123', attendanceDate: new Date('2025-01-17'), status: 'P' },
      ];
      mockAttendanceRepository.find.mockResolvedValue(lowAttendance);

      await expect(
        service.generateMtpr('schedule-123', generateMtprDto, 'user-123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when patient has less than 4 goals', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(mockSchedule);
      mockAttendanceRepository.find.mockResolvedValue(mockAttendance);
      mockGoalRepository.find.mockResolvedValue([mockGoals[0], mockGoals[1]]); // Only 2 goals

      await expect(
        service.generateMtpr('schedule-123', generateMtprDto, 'user-123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByPatient', () => {
    it('should return all MTRPs for a patient', async () => {
      const mockMtprs = [
        { id: 'mtpr-1', patientId: 'patient-123', reviewNumber: 1 },
        { id: 'mtpr-2', patientId: 'patient-123', reviewNumber: 2 },
      ];
      mockMtprRepository.find.mockResolvedValue(mockMtprs);

      const result = await service.findByPatient('patient-123');

      expect(result).toHaveLength(2);
      expect(mockMtprRepository.find).toHaveBeenCalledWith({
        where: { patientId: 'patient-123' },
        relations: ['patient', 'schedule'],
        order: { reviewDate: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return an MTPR by id', async () => {
      const mockMtpr = { id: 'mtpr-123', patientId: 'patient-123' };
      mockMtprRepository.findOne.mockResolvedValue(mockMtpr);

      const result = await service.findOne('mtpr-123');

      expect(result).toEqual(mockMtpr);
      expect(mockMtprRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'mtpr-123' },
        relations: ['patient', 'schedule', 'generatedBy'],
      });
    });

    it('should throw NotFoundException when MTPR is not found', async () => {
      mockMtprRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
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
        relations: ['patient', 'generatedMtpr'],
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
        relations: ['patient', 'generatedMtpr'],
      });
    });

    it('should throw NotFoundException when schedule is not found', async () => {
      mockScheduleRepository.findOne.mockResolvedValue(null);

      await expect(service.getSchedule('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
