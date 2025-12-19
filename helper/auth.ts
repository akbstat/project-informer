import { AuthParam, AuthResponse } from "@/object/auth";

export async function authenticate(param: AuthParam): Promise<string> {
    const response = await fetch('https://active.akesobio.com:8888/akApi/v1/users/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(param),
    });
    const reply: AuthResponse = await response.json();
    return reply.access;
}