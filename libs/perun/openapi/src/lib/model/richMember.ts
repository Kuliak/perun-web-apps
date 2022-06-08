/**
 * Perun RPC API
 * Perun Remote Procedure Calls Application Programming Interface
 *
 * The version of the OpenAPI document: 0.0.0
 * Contact: perun@cesnet.cz
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { User } from './user';
import { Attribute } from './attribute';
import { UserExtSource } from './userExtSource';
import { Member } from './member';

export interface RichMember extends Member {
  user: User;
  userExtSources: Array<UserExtSource> | null;
  userAttributes?: Array<Attribute> | null;
  memberAttributes?: Array<Attribute> | null;
}
