// types.ts
export interface PersonalInfo {
  userid: string;
  firstName: string;
  lastName: string;
  email?: string;
  Phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  relationships?: Relationship[];
}

interface FamilyMember {
  id?: string;
  name: string;
  relationship: string;
  age: string;
}
// types/index.ts
export interface PersonalInfo {
    userid: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    comments?: string;
    salutation?: string;
    unique_id?: string;
    fatherId?: string;
    familyMembers?: FamilyMember[];
  }
  
  export interface ChildRelation {
    id: string;
    relation: 'son' | 'daughter' | 'father';
  }
  
  export interface Relationship {
    id: string;
    relation: 'son' | 'daughter' | 'father';
    firstName?: string;
    lastName?: string;
    phone?: string;
  }