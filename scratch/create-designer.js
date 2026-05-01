const dbConnect = require('../src/lib/dbConnect').default;
const User = require('../src/models/User').default;
const { UserRole, KYCStatus, MembershipPlan } = require('../src/models/User');
const bcrypt = require('bcryptjs');

async function createDesigner() {
  try {
    await dbConnect();
    
    const email = 'huma@designer.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await User.deleteOne({ email });
      console.log('Existing user deleted');
    }

    const user = await User.create({
      name: 'Huma Designs',
      email,
      password: hashedPassword,
      role: UserRole.DESIGNER,
      kycStatus: KYCStatus.APPROVED,
      kycData: {
        businessName: 'Huma Luxury Collective',
        category: 'Bridal Wear',
        experience: '10 Years',
        city: 'Lahore',
        address: 'Gulberg III, Lahore',
        documents: {
          cnicFront: 'https://placehold.co/600x400?text=CNIC+Front',
          cnicBack: 'https://placehold.co/600x400?text=CNIC+Back',
          selfieWithCnic: 'https://placehold.co/600x400?text=Selfie'
        }
      },
      membership: {
        plan: MembershipPlan.MONTHLY,
        status: 'ACTIVE',
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    console.log('Designer Created Successfully:');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (err) {
    console.error('Error creating designer:', err);
  }
}

createDesigner().then(() => process.exit(0));
