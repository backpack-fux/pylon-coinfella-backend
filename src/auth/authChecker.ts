import { AuthChecker } from 'type-graphql';
import * as _ from 'lodash';

const ALL_ROLES = [
  'admin',
  'director',
  'supervisor',
  'lossPrevention',
  'qualityAssurance',
  'teamLead',
  'operator',
  'partner',
  'customer',
  'family',
];

export interface Context {
  user?: any;
}

// create auth checker function
export const customAuthChecker: AuthChecker<Context> = ({ context: { user } }, roles) => {
  return !!user
};
