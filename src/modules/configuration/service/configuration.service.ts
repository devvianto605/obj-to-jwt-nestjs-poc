import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'; // Add jsonwebtoken library
import { PrismaService } from '../../common';
import { ConfigurationData } from '../model/configuration.data';
import { ConfigurationInput } from '../model/configuration.input';

@Injectable()
export class ConfigurationService {

    private readonly jwtSecret = 'your-secret-key'; // Use an environment variable for the secret

    public constructor(
        private readonly prismaService: PrismaService
    ) { }

    public async find(): Promise<ConfigurationData[]> {
        const configurations = await this.prismaService.configuration.findMany({
            include: {
                assets: true, // This tells Prisma to include the related assets
            },
        });

        return configurations.map(configuration => new ConfigurationData(configuration));
    }

    public async findById(id: number): Promise<ConfigurationData | null> {
        const configuration = await this.prismaService.configuration.findUnique({
            where: { id },
            include: { assets: true },
        });

        return configuration ? new ConfigurationData(configuration) : null;
    }

    public async create(data: ConfigurationInput): Promise<ConfigurationData> {
        const configuration = await this.prismaService.configuration.create({
            data: {
                name: data.name,
                assets: {
                    create: data.assets?.map(asset => ({
                        assetType: asset.assetType,
                        assetValue: asset.assetValue,
                    })),
                },
            },
            include: {
                assets: true,
            },
        });

        // Create the JWT token including the assets field
        const token = this.generateJwt(configuration);

        // Store the JWT token in the Token model
        await this.prismaService.token.create({
            data: {
                token,
                configurationId: configuration.id,
            },
        });

        return new ConfigurationData(configuration);
    }

    public async update(id: number, data: ConfigurationInput): Promise<ConfigurationData> {
        // Check if the configuration exists
        const existingConfiguration = await this.prismaService.configuration.findUnique({
            where: { id },
            include: { assets: true },
        });

        if (!existingConfiguration) {
            throw new NotFoundException(`Configuration with ID ${id} not found`);
        }

        // Update the configuration and related assets
        const updatedConfiguration = await this.prismaService.configuration.update({
            where: { id },
            data: {
                name: data.name,
                assets: {
                    upsert: data.assets?.map(asset => ({
                        where: { id: asset.id },
                        update: {
                            assetType: asset.assetType,
                            assetValue: asset.assetValue,
                        },
                        create: {
                            assetType: asset.assetType,
                            assetValue: asset.assetValue,
                        },
                    })) || [],
                },
            },
            include: {
                assets: true,
            },
        });

        // Create a new JWT token and update the Token model
        const token = this.generateJwt(updatedConfiguration);

        await this.prismaService.token.upsert({
            where: { configurationId: updatedConfiguration.id},
            update: { token },
            create: {
                token,
                configurationId: updatedConfiguration.id,
            },
        });

        return new ConfigurationData(updatedConfiguration);
    }

    public async delete(id: number): Promise<void> {
        // Check if the configuration exists
        const existingConfiguration = await this.prismaService.configuration.findUnique({
            where: { id },
        });

        if (!existingConfiguration) {
            throw new NotFoundException(`Configuration with ID ${id} not found`);
        }

        // Delete related tokens
        await this.prismaService.token.deleteMany({
            where: { configurationId: id },
        });

        // Delete the configuration and related assets
        await this.prismaService.configuration.delete({
            where: { id },
        });
    }

    public async getToken(id: number): Promise<string | null> {
        const token = await this.prismaService.token.findUnique({
            where: { configurationId: id },
        });

        return token ? token.token : null;
    }

    public async decodeToken(token: string): Promise<ConfigurationData> {
        try {
            // Verify and decode the JWT token
            const decoded = jwt.verify(token, this.jwtSecret) as { id: number };

            // Fetch the configuration using the ID from the token
            const configuration = await this.prismaService.configuration.findUnique({
                where: { id: decoded.id },
                include: { assets: true },
            });

            if (!configuration) {
                throw new NotFoundException(`Configuration with ID ${decoded.id} not found`);
            }

            return new ConfigurationData(configuration);
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedException('Invalid or expired token');
            }
            throw error;
        }
    }

    private generateJwt(payload: ConfigurationData): string {
        return jwt.sign(payload, this.jwtSecret); // Adjust expiration as needed
    }

}
