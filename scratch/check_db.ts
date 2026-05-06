import dbConnect from './src/lib/dbConnect';
import EventApplication from './src/models/EventApplication';
import Event from './src/models/Event';
import Designer from './src/models/Designer';
import Blog from './src/models/Blog';
import Subscriber from './src/models/Subscriber';
import Transaction from './src/models/Transaction';
import Plan from './src/models/Plan';

async function checkData() {
  await dbConnect();
  console.log('--- Database Stats ---');
  console.log('Events:', await Event.countDocuments());
  console.log('Designers:', await Designer.countDocuments());
  console.log('Blogs:', await Blog.countDocuments());
  console.log('Subscribers:', await Subscriber.countDocuments());
  console.log('Event Applications:', await EventApplication.countDocuments());
  console.log('Transactions:', await Transaction.countDocuments());
  console.log('Plans:', await Plan.countDocuments());
  process.exit(0);
}

checkData();
