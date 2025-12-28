/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: contentsubmissions
 * Interface for ContentSubmissions
 */
export interface ContentSubmissions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType image */
  submittedContent?: string;
  /** @wixFieldType text */
  userEmail?: string;
  /** @wixFieldType text */
  reviewStatus?: string;
  /** @wixFieldType boolean */
  ageAndContentConfirmed?: boolean;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
  /** @wixFieldType text */
  paymentConfirmationId?: string;
  /** @wixFieldType text */
  moderatorNotes?: string;
}


/**
 * Collection ID: legalpolicies
 * Interface for LegalPolicies
 */
export interface LegalPolicies {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  policyName?: string;
  /** @wixFieldType text */
  policyTitle?: string;
  /** @wixFieldType text */
  policyContent?: string;
  /** @wixFieldType date */
  lastUpdatedDate?: Date | string;
  /** @wixFieldType text */
  versionNumber?: string;
}
