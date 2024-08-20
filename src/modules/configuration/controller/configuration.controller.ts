import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Query, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '../../common';
import { ConfigurationPipe } from '../flow/configuration.pipe';
import { ConfigurationData } from '../model/configuration.data';
import { ConfigurationInput } from '../model/configuration.input';
import { ConfigurationService } from '../service/configuration.service';

@Controller('configurations')
@ApiTags('configuration')
// @ApiBearerAuth()
export class ConfigurationController {

    public constructor(
        private readonly logger: LoggerService,
        private readonly configurationService: ConfigurationService
    ) { }

    @Get()
    @ApiOperation({ summary: 'Find configurations' })
    @ApiResponse({ status: HttpStatus.OK, type: [ConfigurationData] })
    public async find(): Promise<ConfigurationData[]> {
        return this.configurationService.find();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find configuration by ID' })
    @ApiResponse({ status: HttpStatus.OK, type: ConfigurationData })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Configuration not found' })
    public async findById(@Param('id') id: string): Promise<ConfigurationData> {
        const numericId = parseInt(id, 10); // Convert the string to a number
        if (isNaN(numericId)) {
            throw new BadRequestException('Invalid ID format');
        }

        const configuration = await this.configurationService.findById(numericId);
        if (!configuration) {
            throw new NotFoundException(`Configuration with ID ${numericId} not found`);
        }
        return configuration;
    }

    @Post()
    // Remove guard for testing purpose
    // @UseGuards(RestrictedGuard)
    @ApiOperation({ summary: 'Create configuration' })
    @ApiResponse({ status: HttpStatus.CREATED, type: ConfigurationData })
    public async create(@Body(ConfigurationPipe) input: ConfigurationInput): Promise<ConfigurationData> {
        const configuration = await this.configurationService.create(input);
        this.logger.info(`Created new configuration with ID ${configuration.id}`);
        return configuration;
    }

    @Put(':id')
    // @UseGuards(RestrictedGuard)
    @ApiOperation({ summary: 'Update configuration' })
    @ApiResponse({ status: HttpStatus.OK, type: ConfigurationData })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Configuration not found' })
    public async update(@Param('id') id: string, @Body(ConfigurationPipe) input: ConfigurationInput): Promise<ConfigurationData> {
        const numericId = parseInt(id, 10); // Convert the string to a number
        if (isNaN(numericId)) {
            throw new BadRequestException('Invalid ID format');
        }

        const configuration = await this.configurationService.update(numericId, input);
        if (!configuration) {
            throw new NotFoundException(`Configuration with ID ${numericId} not found`);
        }
        return configuration;
    }

    @Delete(':id')
    // @UseGuards(RestrictedGuard)
    @ApiOperation({ summary: 'Delete configuration' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Configuration successfully deleted' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Configuration not found' })
    public async delete(@Param('id') id: string): Promise<void> {
        const numericId = parseInt(id, 10); // Convert the string to a number
        if (isNaN(numericId)) {
            throw new BadRequestException('Invalid ID format');
        }

        await this.configurationService.delete(numericId);
        this.logger.info(`Deleted configuration with ID ${numericId}`);
    }

    @Get(':id/token')
    @ApiOperation({ summary: 'Get token for configuration' })
    @ApiResponse({ status: HttpStatus.OK, description: 'JWT token for the configuration' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Configuration not found' })
    public async getToken(@Param('id') id: string): Promise<{ token: string }> {
        const numericId = parseInt(id, 10); // Convert the string to a number
        if (isNaN(numericId)) {
            throw new BadRequestException('Invalid ID format');
        }

        const token = await this.configurationService.getToken(numericId);
        if (!token) {
            throw new NotFoundException(`Token for configuration with ID ${numericId} not found`);
        }
        return { token };
    }


    @Get('decode')
    // @UseGuards(RestrictedGuard)
    @ApiOperation({ summary: 'Decode JWT token and return configuration data' })
    @ApiResponse({ status: 200, type: ConfigurationData })
    @ApiResponse({ status: 401, description: 'Invalid or expired token' })
    public async decodeToken(@Query('token') token: string): Promise<ConfigurationData> {
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        return this.configurationService.decodeToken(token);
    }
}
