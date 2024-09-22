// pages/api/auth/google-signin.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, phoneNumber } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Try to find the user by email or phone number
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { personalInfo: { phoneNumber } }
        ]
      },
      include: {
        personalInfo: true
      }
    });

    if (user) {
      // User exists, return the user data
      return res.status(200).json(user);
    } else {
      // User doesn't exist, create a new user
      user = await prisma.user.create({
        data: {
          email,
          role: 'USER',
          personalInfo: {
            create: {
              email,
              phoneNumber,
              firstName: '',
              lastName: ''
            }
          }
        },
        include: {
          personalInfo: true
        }
      });

      return res.status(201).json(user);
    }
  } catch (error) {
    console.error('Error in Google Sign In:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}