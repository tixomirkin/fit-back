import { SetMetadata } from '@nestjs/common';
import {Permission} from "./permission-enum";

export const PERMISSIONS_KEY = 'permissions';
export const ProjectPermissions = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_KEY, permissions);