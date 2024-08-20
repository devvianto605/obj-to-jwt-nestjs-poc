import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { ConfigurationController } from './controller';
import { ConfigurationService } from './service';

@Module({
    imports: [
        CommonModule,
    ],
    controllers: [
        ConfigurationController
    ],
    providers: [
        ConfigurationService
    ],
    exports: []
})
export class ConfigurationModule {}
