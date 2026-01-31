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
  /** @wixFieldType boolean */
  automaticallyPublished?: boolean;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  submittedContent?: string;
  /** @wixFieldType datetime */
  aiReviewTimestamp?: Date | string;
  /** @wixFieldType text */
  aiRejectionReason?: string;
  /** @wixFieldType text */
  aiReviewStatus?: string;
  /** @wixFieldType url */
  submittedVideo?: string;
  /** @wixFieldType text */
  contentType?: string;
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
