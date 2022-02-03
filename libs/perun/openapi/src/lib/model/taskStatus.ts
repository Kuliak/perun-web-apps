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

export type TaskStatus =
  | 'WAITING'
  | 'PLANNED'
  | 'GENERATING'
  | 'GENERROR'
  | 'GENERATED'
  | 'SENDING'
  | 'DONE'
  | 'SENDERROR'
  | 'ERROR'
  | 'WARNING';

export const TaskStatus = {
  WAITING: 'WAITING' as TaskStatus,
  PLANNED: 'PLANNED' as TaskStatus,
  GENERATING: 'GENERATING' as TaskStatus,
  GENERROR: 'GENERROR' as TaskStatus,
  GENERATED: 'GENERATED' as TaskStatus,
  SENDING: 'SENDING' as TaskStatus,
  DONE: 'DONE' as TaskStatus,
  SENDERROR: 'SENDERROR' as TaskStatus,
  ERROR: 'ERROR' as TaskStatus,
  WARNING: 'WARNING' as TaskStatus,
};
