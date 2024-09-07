import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { SupabaseService } from '../services/supabase.service';

export interface Profile {
  id?: string;
  username: string;
  email: string; 
  avatar_url?: string; 
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;
  private _session: AuthSession | null = null;
  currentUser: any

  constructor(   private readonly supaabase: SupabaseService,) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, email, avatar_url`)
      .eq('id', user.id)
      .single();
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async signup(email: string, password: string, name: string) {
    try {
      // Sign up the user with Supabase Auth
      const { data, error } = await this.supabase.auth.signUp({ email, password });
      if (error) throw error;
  
      // If the user successfully signed up, check for the profile
      if (data.user) {
        const userId = data.user.id;
  
        // Check if profile already exists
        const { data: profileData, error: profileError } = await this.supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
  
        if (profileError && profileError.code !== 'PGRST116') {
          // Handle other possible errors (e.g., network error)
          throw profileError;
        }
  
        // If the profile does not exist, insert it
        if (!profileData) {
          const { error: insertError } = await this.supabase.from('profiles').insert([
            { id: userId, full_name: name, updated_at: new Date() },
          ]);
          if (insertError) throw insertError;
        } else {
          // If it does exist, you might want to update its details
          const { error: updateError } = await this.supabase.from('profiles').update({
            full_name: name,
            updated_at: new Date(),
          }).eq('id', userId);
  
          if (updateError) throw updateError;
        }
      }
  
      console.log('User registered:', data.user);
    } catch (error) {
      console.error('Signup error:', error);
      throw error; // Re-throw error to handle it elsewhere if necessary
    }
  }

  async login(email: string, password: string) {
    try {
      const { error } = await this.supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  logout() {
    return this.supabase.auth.signOut();
  }

  async getUserId(): Promise<string | null> {
    const { data: { session } }  = await this.supabase.auth.getSession();
    return session?.user?.id || null;
  }

  // async getUsername(): Promise<User | null> {
  //   const { data: { session } } = await this.supabase.auth.getSession();
  //   return session?.name || null;
  // }


  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session?.user || null;
  }

  async sendPasswordResetEmail(email: string) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email);
      if (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
  // Update the updateProfile method to match your project's requirements
  async updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    };

    // Update the 'profiles' table in Supabase
    const { error } = await this.supabase
      .from('profiles')
      .upsert(update)
      .eq('id', profile.id); // Assuming you have an 'id' field in your profiles table

    if (error) {
      throw error;
    }

    // If you want to update the user's display name in Supabase Auth as well
    // you'll need to use the Supabase Auth API directly (check Supabase docs)
    // Example: 
    // await this.supabase.auth.updateUser({ data: { full_name: profile.full_name } });
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file);
  }

  setCurrentUser(user: User | null) {
    this.currentUser = user;
  }

  async onSubmit(signInForm: any): Promise<any> {
    try {
      const email = signInForm.value.email as string
      const { error } = await this.supaabase.signIn(email)
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      return 'reset'
    }
  }

}