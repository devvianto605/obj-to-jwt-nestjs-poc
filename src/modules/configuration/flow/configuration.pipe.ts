import * as Joi from 'joi';

import { JoiValidationPipe } from '../../common';
import { ConfigurationInput } from '../model/configuration.input';

export class ConfigurationPipe extends JoiValidationPipe {

    public buildSchema(): Joi.Schema {

        return Joi.object<ConfigurationInput>({
            name: Joi.string().required(),
            assets: Joi.array().required()
        });
    }
 }