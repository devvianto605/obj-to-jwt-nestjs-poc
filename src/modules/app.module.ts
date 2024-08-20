import { Module } from '@nestjs/common';

import { CommonModule } from './common';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
    imports: [
        CommonModule,
        ConfigurationModule
    ]
})
export class ApplicationModule {}
