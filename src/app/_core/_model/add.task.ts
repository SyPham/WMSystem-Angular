import { JobType } from '../enum/task.enum';

export class AddTask {
    Jobtype: JobType;
    OcId: number;
    constructor(Jobtype: JobType = JobType.Unknown, OcId: number = 0) {
        this.Jobtype = Jobtype;
        this.OcId = OcId;
    }
}