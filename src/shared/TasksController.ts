import { BackendMethod, Remult, Allow } from "remult";
import { Task } from "./Task";
import { Roles } from "./Roles";

export class TasksController {
    
    @BackendMethod({ allowed: Roles.admin })
    static async setAll(completed: boolean, remult?: Remult) {
        const taskRepo = remult!.repo(Task);

        for (const task of await taskRepo.find()) {
            await taskRepo.save({ ...task, completed });
        }
   }
}
