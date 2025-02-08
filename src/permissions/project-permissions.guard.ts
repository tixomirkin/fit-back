import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable
} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {PERMISSIONS_KEY} from "./permissions.decorator";
import {DrizzleAsyncProvider} from "../drizzle/drizzle.provider";
import {NodePgDatabase} from "drizzle-orm/node-postgres";
import * as schema from "../drizzle/schema";
import {accessTable} from "../drizzle/schema";
import {and, eq} from "drizzle-orm";
import {Permission} from "./permission-enum";

@Injectable()
export class ProjectPermissionsGuard implements CanActivate {
    constructor(private  reflector: Reflector,
                @Inject(DrizzleAsyncProvider)
                private db: NodePgDatabase<typeof schema>) {}

    async canActivate(context: ExecutionContext) {
        const requiredPermissions = this.reflector.get<Permission[]>(PERMISSIONS_KEY, context.getHandler())
        if (!requiredPermissions) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) throw new ForbiddenException('Необходима аутентификация');

        if (!request.params.project_id && !request.query.project_id) throw new ForbiddenException('Не передан id проекта');
        const projectId = request.params.project_id || request.query.project_id;
        if (!parseInt(projectId)) throw new BadRequestException('id проекта должно быть числом')

        const access = await this.db.query.accessTable.findFirst({
            where: and(eq(accessTable.projectId, projectId), eq(accessTable.userId, user.id)),
            with: {
                project: true,
            }
        })
        if (!access) throw new ForbiddenException('У вас нет доступа к проекту');
        if (!access.project) throw new ForbiddenException('Проект не найден!');
        request.access = access
        request.project = access.project

        if (access.role == "owner" || access.role == "admin") return true
        const hasAccess = requiredPermissions.every((permission) => access.permissions[permission]);

        if (!hasAccess) {
            throw new ForbiddenException('Недостаточно прав');
        }

        return true;
    }
}