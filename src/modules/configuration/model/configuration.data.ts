import { ApiProperty } from '@nestjs/swagger';
import { Configuration, Asset } from '@prisma/client';

export class ConfigurationData {

    @ApiProperty({ description: 'Configuration unique ID', example: '36635263' })
    public readonly id: number;

    @ApiProperty({ description: 'Configuration name', example: 'My configuration' })
    public readonly name: string;

    @ApiProperty({
        description: 'Array of configuration assets',
        example: [
            { assetType: 'asset1', assetValue: 'value1' },
            { assetType: 'asset2', assetValue: 'value2' },
            { assetType: 'asset3', assetValue: 'value3' }
        ],
    })
    public readonly assets: Asset[];

    public constructor(entity: Configuration & { assets: Asset[] }) {
        this.id = entity.id;
        this.name = entity.name;
        this.assets = entity.assets.map(asset => ({
            id: asset.id,
            assetType: asset.assetType,
            assetValue: asset.assetValue,
            configurationId: asset.configurationId
        }));
    }
}
