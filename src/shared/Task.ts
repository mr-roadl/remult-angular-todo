import { Entity, Fields, Allow} from "remult";
import { Roles } from "./Roles";

@Entity("tasks", {
    allowApiCrud: Allow.authenticated
})
export class Task {
    @Fields.uuid()
    id!: string;

    @Fields.string<Task>({
        validate: (task) => {
            if (task.title.length < 3)
                throw "Too Short";
        },
        allowApiUpdate: Roles.admin
    })
    title = '';

    @Fields.boolean()
    completed = false;
}
