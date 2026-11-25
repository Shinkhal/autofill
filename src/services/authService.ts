// services/authService.ts
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

export const decodeToken = (token: string): User | null => {
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      image: payload.image,
    };
  } catch (error) {
    console.error('Token decoding failed:', error);
    localStorage.removeItem('token');
    return null;
  }
};
