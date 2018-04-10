/**
 * Interface used for the login component
 */
export interface AuthenticatedUser {
    /**
     * User's name or username
     */
    name: string;
    /**
     * Password used to login
     */
    password: string;
    /**
     * User Email address
     */
    email?: string;
    /**
     * User ID
     */
    uid?: number;
}
