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
export interface Profile {
  id?: string;
  username: string;
  website: string;
  avatar_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
          persistSession: true, // Enable session persistence (if not already enabled)
          detectSessionInUrl: false, // Disable session detection in URL
          autoRefreshToken: true, // Enable automatic token refresh
        },
      }
    );
  }

  getSupabaseClient() {
    return this.supabase;
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
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single();
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    };

    return this.supabase.from('profiles').upsert(update);
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file);
  }

  ////////////////////////////////////////////////////////////////////
  // Garden Code
  ////////////////////////////////////////////////
  async uploadImage(file: File) {
    const filePath = `gardens/${file.name}`; // Adjust the path as needed
    const { data, error } = await this.supabase.storage
      .from('gardens')
      .upload(filePath, file);

    if (error) {
      throw new Error(`Upload error: ${error.message}`);
    }

    return data; // This will contain the uploaded file path
  }

  async saveGarden(garden: any) {
    const { data, error } = await this.supabase
      .from('gardens')
      .insert([garden]);

    if (error) {
      throw new Error(`Save error: ${error.message}`);
    }

    return data; // Return the garden data back
  }

  async getNearbyGardens(
    lat: number,
    lng: number,
    radius: number,
    type: string
  ) {
    // Determine which gardens to fetch based on the type
    let query = this.supabase.from('gardens').select('*');

    // // Adjust the query based on the type
    // if (type === 'all') {
    //   // Fetch all gardens (both public and private)
    //   // No additional filter needed
    // } else {
    //   // Fetch gardens of the specified type (public/private)
    //   query = query.eq('type', type);
    // }

    // Execute the query
    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching gardens: ${error.message}`);
    }

    // Now, filter the results using the Haversine formula in-code
    const nearbyGardens = data.filter((garden) => {
      const gardenLat = garden.latitude;
      const gardenLng = garden.longitude;

      // Calculate the distance using the Haversine formula
      var distance = this.haversineDistance(lat, lng, gardenLat, gardenLng);
      distance = distance * 1000;
      return distance <= radius; // Filter by radius
    });

    return nearbyGardens;
  }

  // Haversine distance calculation
  private haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) *
        Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  // Helper function to convert degrees to radians
  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async getUsername(userId: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single(); // Use .single() to get a single object

    if (error) {
      console.error('Error fetching username:', error);
      return null; // Return null or handle error as needed
    }

    return data?.username || null; // Return username if found, otherwise null
  }

  async getGardensByUserId(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('gardens')
      .select('*')
      .eq('createdbyuid', userId); // Assuming the column name is created_by_uid

    if (error) {
      throw error; // Handle error if needed
    }

    return data || []; // Return empty array if no data is found
  }

  async deleteGarden(gardenId: string): Promise<void> {
    const { error } = await this.supabase
      .from('gardens')
      .delete()
      .eq('id', gardenId); // Assuming the column name is `id`

    if (error) {
      throw error; // Handle error if needed
    }
  }

  async getGardenById(gardenId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('gardens')
      .select('*')
      .eq('id', gardenId)
      .single(); // Fetch a single garden by ID

    if (error) {
      throw error; // Handle error accordingly
    }

    return data; // Return the garden data
  }

  async updateGarden(garden: any): Promise<void> {
    const { error } = await this.supabase
      .from('gardens')
      .update({
        name: garden.name,
        description: garden.description,
        sqft: garden.sqft,
        type: garden.type,
        imageurls: garden.imageurls,
        latitude: garden.latitude,
        longitude: garden.longitude,
        address: garden.address,
        updated_at: new Date(),
      })
      .eq('id', garden.id); // Ensure to update the correct garden by ID

    if (error) {
      throw error; // Handle error accordingly
    }
  }

  async getAllTopics(): Promise<any[]> {
    const { data, error } = await this.supabase.from('topics').select('*');

    if (error) {
      throw error;
    }

    return data || [];
  }

  // Create a new topic
  async createTopic(topic: any): Promise<any> {
    const { data, error } = await this.supabase.from('topics').insert([topic]);
    if (error) {
      throw error;
    }
    return data; // Return the garden data back
  }

  // Update an existing topic
  async updateTopic(topicId: string, topic: any): Promise<void> {
    const { error } = await this.supabase
      .from('topics')
      .update(topic)
      .eq('id', topicId);

    if (error) {
      throw error;
    }
  }

  // Get topics created by a specific user
  async getTopicsByUserId(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('topics')
      .select('*')
      .eq('created_by_uid', userId);

    if (error) {
      throw error;
    }

    return data || [];
  }

  // Get a topic by ID
  async getTopicById(topicId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('topics')
      .select('*')
      .eq('id', topicId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  // Delete a topic
  async deleteTopic(topicId: string): Promise<void> {
    const { error } = await this.supabase
      .from('topics')
      .delete()
      .eq('id', topicId);

    if (error) {
      throw error;
    }
  }

  // Fetch comments for a specific topic
  async getCommentsByTopicId(topicId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('comments')
      .select('*')
      .eq('topic_id', topicId);

    if (error) {
      throw error;
    }

    return data || [];
  }

  // Create a new comment
  async createComment(comment: any): Promise<void> {
    const { error } = await this.supabase.from('comments').insert([comment]);
    if (error) {
      throw error;
    }
  }

  // Upload an image to Supabase storage

  // async uploadImageTopic(file: File): Promise<any> {

  //   const { data, error } = await this.supabase.storage.from('gardens').upload(`images/${file.name}`, file);

  //   if (error) {
  //     throw error;
  //   }

  //   const publicUrl = this.supabase.storage.from('gardens').getPublicUrl(data.path);
  //   return { path: data.path, publicUrl: publicUrl.data.publicUrl };
  // }

  async createResource(resource: any): Promise<void> {
    const { error } = await this.supabase.from('resources').insert([resource]);
    if (error) {
      throw error;
    }
  }

  // Get all resources
  async getAllResources(): Promise<any[]> {
    const { data, error } = await this.supabase.from('resources').select('*');
    if (error) {
      throw error;
    }
    return data || [];
  }

  // Get resources created by a specific user
  async getResourcesByUserId(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('resources')
      .select('*')
      .eq('created_by_uid', userId);

    if (error) {
      throw error;
    }

    return data || [];
  }

  // Get a specific resource by ID
  async getResourceById(resourceId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('resources')
      .select('*')
      .eq('id', resourceId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  // Update a resource
  async updateResource(resourceId: string, resource: any): Promise<void> {
    const { error } = await this.supabase
      .from('resources')
      .update(resource)
      .eq('id', resourceId);

    if (error) {
      throw error;
    }
  }

  // Delete a resource
  async deleteResource(resourceId: string): Promise<void> {
    const { error } = await this.supabase
      .from('resources')
      .delete()
      .eq('id', resourceId);

    if (error) {
      throw error;
    }
  }

  // Create a resource request
  async createResourceRequest(request: any): Promise<void> {
    const { error } = await this.supabase
      .from('resourcerequests')
      .insert([request]);
    if (error) {
      throw error;
    }
  }

  // Get requests for a specific resource
  async getRequestsByResourceId(resourceId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('resourcerequests')
      .select('*')
      .eq('resource_id', resourceId);

    if (error) {
      throw error;
    }

    return data || [];
  }

  async getRequestsByUserId(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('ResourceRequests')
      .select('*')
      .eq('requester_id', userId); // Assuming requester_id links back to users

    if (error) {
      throw error;
    }

    return data || [];
  }

  async getCommentsByResourceId(resourceId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('comments')
      .select('*')
      .eq('resource_id', resourceId); // Assuming resource_id exists in Comments table

    if (error) {
      throw error; // Handle error if needed
    }

    return data || []; // Return an empty array if no comments are found
  }

  async getProfileById(userId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

}
