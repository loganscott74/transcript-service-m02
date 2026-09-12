import { beforeEach, describe, expect, it } from 'vitest';
import { TranscriptDB, type TranscriptService } from './transcript.service.ts';

let db: TranscriptService;
beforeEach(() => {
  db = new TranscriptDB();
});

describe('addStudent', () => {
  it('should add a student to the database and return their id', () => {
    expect(db.nameToIDs('blair')).toStrictEqual([]);
    const id1 = db.addStudent('blair');
    expect(db.nameToIDs('blair')).toStrictEqual([id1]);
  });

  it('should return an ID distinct from any ID in the database', () => {
    // we'll add 3 students and check to see that their IDs are all different.
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('corey');
    const id3 = db.addStudent('del');
    expect(id1).not.toEqual(id2);
    expect(id1).not.toEqual(id3);
    expect(id2).not.toEqual(id3);
  });

  it('should permit adding a student w/ same name as an existing student', () => {
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('blair');
    expect(id1).not.toEqual(id2);
  });
});

describe('getTranscript', () => {
  it('given the ID of a student, should return the student’s transcript', () => {
    const id1 = db.addStudent('blair');
    expect(db.getTranscript(id1)).not.toBeNull();
  });

  it('given the ID that is not the ID of any student, should throw an error', () => {
    // in an empty database, all IDs are bad :)
    // Note: the expression you expect to throw
    // must be wrapped in a (() => ...)
    expect(() => db.getTranscript(1)).toThrowError();
  });
});

describe('addGrade', () => {
  it('given a valid student ID, course, and grade, should add the grade to the student transcript', () => {
    const id1 = db.addStudent('blair');
    db.addGrade(id1, 'CS4530', { course: 'CS4530', grade: 90 });
    expect(db.getGrade(id1, 'CS4530')).toEqual(90);
  });

  it('given a valid student ID, course, and grade, should add the grade to the student transcript when other grades are present', () => {
    const id1 = db.addStudent('blair');
    db.addGrade(id1, 'CS4530', { course: 'CS4530', grade: 90 });
    db.addGrade(id1, 'CS4531', { course: 'CS4531', grade: 85 });
    expect(db.getGrade(id1, 'CS4530')).toEqual(90);
    expect(db.getGrade(id1, 'CS4531')).toEqual(85);
  });

  it('given two valid student ID, a course, and a grade, should add the grade to only the one student transcript', () => {
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('corey');
    db.addGrade(id1, 'CS4530', { course: 'CS4530', grade: 90 });
    expect(db.getGrade(id1, 'CS4530')).toEqual(90);
    expect(db.getGrade(id2, 'CS4530')).toBeUndefined();
  });

  it('given a valid student ID, a valid course, and a missmatching grade, should not add the grade to the student transcript', () => {
    const id1 = db.addStudent('blair');
    // Throw since the course in the grade object does not match the course parameter
    expect(db.addGrade(id1, 'CS4530', { course: 'CS5000', grade: 90 })).toThrowError();
    expect(db.getGrade(id1, 'CS5000')).toBeUndefined();
    expect(db.getGrade(id1, 'CS4530')).toBeUndefined();
  });

  it('given a valid student ID, an invalid course, and a invalid grade, should not add the grade to the student transcript', () => {
    const id1 = db.addStudent('blair');
    // Throw since course is empty
    expect(db.addGrade(id1, '', { course: '', grade: 90 })).toThrowError();
    expect(db.getGrade(id1, '')).toBeUndefined();
  });

  it('given two valid student ID, courses, and grades, should add the grades to only the respective student transcript', () => {
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('blair');
    db.addGrade(id1, 'CS4530', { course: 'CS4530', grade: 90 });
    db.addGrade(id2, 'CS4530', { course: 'CS4530', grade: 85 });
    expect(db.getGrade(id1, 'CS4530')).toEqual(90);
    expect(db.getGrade(id2, 'CS4530')).toEqual(85);
  });
});
