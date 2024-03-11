import { Client, Account, Databases } from 'appwrite';


const client = new Client();
    client.setEndpoint(import.meta.env.VITE_APP_APPWRITE_ENDPOINT).setProject(import.meta.env.VITE_APP_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const database = new Databases(client);