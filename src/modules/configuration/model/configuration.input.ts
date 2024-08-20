import { PickType } from '@nestjs/swagger';
import { ConfigurationData } from './configuration.data';

export class ConfigurationInput extends PickType(ConfigurationData, ['name', 'assets'] as const) {}