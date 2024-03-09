const express = require("express");
const router = express.Router();
const multer = require("multer");
const Post = require("../models/post");
const Interest = require("../models/Interest");
const Ads = require("../models/Ads");
const Advertiser = require("../models/Advertiser");
const Admin = require("../models/admin");
const Comment = require("../models/comment");
const Topic = require("../models/topic");
const Community = require("../models/community");
const User = require("../models/userAuth");
const Analytics = require("../models/Analytics");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

const uuid = require("uuid").v4;
require("dotenv").config();

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const POST_BUCKET = process.env.POST_BUCKET;

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

function findCorrespondingFile({ fileName, extensions }) {
  for (const e of extensions) {
    const file = path.join(directoryPath, `${fileName}.${e}`);
    if (fs.existsSync(file)) {
      return file;
    } else {
      null;
    }
  }
}

function findCorrespondingTextFile(f) {
  const parsedPath = path.parse(f);
  const fileNameWithoutExtension = parsedPath.name;
  const textFileName = `${fileNameWithoutExtension}.txt`;
  const textFilePath = path.join(parsedPath.dir, textFileName);
  return textFilePath;
}

function getFileExtension(filePath) {
  return path.extname(filePath).toLowerCase();
}

const action = async () => {
  try {
    const randomNumber = Math.floor(Math.random() * 7);

    const select = [
      { text: "view" },
      { text: "like" },
      { text: "comment" },
      { text: "share" },
      { text: "join" },
      { text: "unjoin" },
      { text: "visits" },
    ];

    const positiveComments = [
      "Great job!",
      "Well done!",
      "Amazing work!",
      "You're doing fantastic!",
      "Excellent effort!",
      "Fantastic job!",
      "Brilliant work!",
      "Keep up the good work!",
      "Outstanding performance!",
      "You're a star!",
      "Impressive work!",
      "You're doing wonderfully!",
      "Fantastic effort!",
      "Spectacular work!",
      "Incredible job!",
      "You're killing it!",
      "Remarkable work!",
      "Superb effort!",
      "Terrific job!",
      "You're on fire!",
      "Exceptional work!",
      "Awesome job!",
      "You're nailing it!",
      "Phenomenal work!",
      "You're a rockstar!",
      "Way to go!",
      "Bravo!",
      "You're smashing it!",
      "Magnificent work!",
      "You're the best!",
      "Keep it up!",
      "Wonderful job!",
      "You're unstoppable!",
      "Stellar effort!",
      "You're shining bright!",
      "Hats off to you!",
      "Splendid work!",
      "You're a champion!",
      "Top-notch effort!",
      "You're a legend!",
      "Exceptional performance!",
      "You're a genius!",
      "Flawless work!",
      "You're remarkable!",
      "First-rate effort!",
      "You're outstanding!",
      "Bravo to you!",
      "You're a master!",
      "Exemplary work!",
      "You're incredible!",
      "You're a superhero!",
      "Kudos to you!",
      "You're awe-inspiring!",
      "You're phenomenal!",
      "You're breathtaking!",
      "Tremendous effort!",
      "You're a wizard!",
      "You're a marvel!",
      "You're extraordinary!",
      "You're a powerhouse!",
      "You're a shining star!",
      "You're a role model!",
      "You're a beacon of light!",
      "You're a force to be reckoned with!",
      "You're a game-changer!",
      "You're a trailblazer!",
      "You're an inspiration!",
      "You're a ray of sunshine!",
      "You're a bright spark!",
      "You're a breath of fresh air!",
      "You're a source of inspiration!",
      "You're a ray of hope!",
      "You're a guiding light!",
      "You're a positive influence!",
      "You're a true asset!",
      "You're doing an amazing job!",
      "Your work ethic is truly admirable!",
      "You look fantastic!",
      "Your dedication is inspiring!",
      "Keep up the great work!",
      "You're making a difference!",
      "You're a valuable asset!",
      "Your positivity is infectious!",
      "You're a true professional!",
      "You're on the right track!",
      "You're a role model!",
      "You're exceptionally talented!",
      "You're an inspiration to others!",
      "Your efforts are paying off!",
      "You're going places!",
      "You're a breath of fresh air!",
      "You're a ray of sunshine!",
      "Your commitment is commendable!",
      "You're a rockstar!",
      "Your enthusiasm is contagious!",
      "You're doing fantastic work!",
      "You're exceeding expectations!",
      "You're a joy to work with!",
      "You're truly remarkable!",
      "You're incredibly creative!",
      "You're making waves!",
      "You're destined for greatness!",
      "You're a real go-getter!",
      "Your positivity brightens my day!",
      "You're a true professional!",
      "You're doing an amazing job!",
      "Your work ethic is truly admirable!",
      "You look fantastic!",
      "Your dedication is inspiring!",
      "Keep up the great work!",
      "You're making a difference!",
      "You're a valuable asset!",
      "Your positivity is infectious!",
      "You're a true professional!",
      "You're on the right track!",
      "You're a role model!",
      "You're exceptionally talented!",
      "You're an inspiration to others!",
      "Your efforts are paying off!",
      "You're going places!",
      "You're a breath of fresh air!",
      "You're a ray of sunshine!",
      "Your commitment is commendable!",
      "You're a rockstar!",
      "Your enthusiasm is contagious!",
      "You're doing fantastic work!",
      "You're exceeding expectations!",
      "You're a joy to work with!",
      "You're truly remarkable!",
      "You're incredibly creative!",
      "You're making waves!",
      "You're destined for greatness!",
      "You're a real go-getter!",
      "Your positivity brightens my day!",
      "You're an inspiration to everyone around you!",
      "You have a heart of gold!",
      "Your kindness knows no bounds!",
      "You bring out the best in others!",
      "Your perseverance is admirable!",
      "You're a beacon of hope!",
      "Your optimism is contagious!",
      "You have a magnetic personality!",
      "You light up the room with your presence!",
      "You're a true gem!",
      "Your smile is infectious!",
      "You're a shining example!",
      "You make challenges seem effortless!",
      "You're a source of strength for others!",
      "You have a gift for making people feel valued!",
      "You're a true asset to the team!",
      "Your generosity knows no limits!",
      "You're a fountain of creativity!",
      "Your positive attitude is inspiring!",
      "You have a knack for making things better!",
      "You have an incredible work ethic!",
      "Your determination is unmatched!",
      "You handle challenges with grace!",
      "You're a beacon of positivity!",
      "You're a breath of fresh air!",
      "Your energy is contagious!",
      "You're a problem-solving genius!",
      "You're a true team player!",
      "You have a knack for bringing people together!",
      "Your optimism is infectious!",
      "You have an incredible sense of humor!",
      "You're a ray of sunshine on a cloudy day!",
      "Your positivity is uplifting!",
      "You're an absolute joy to be around!",
      "You're an invaluable member of the team!",
      "Your creativity knows no bounds!",
      "You have a knack for making people feel welcome!",
      "You're a true inspiration to others!",
      "You have an incredible ability to motivate others!",
      "You're a force to be reckoned with!",
      "तुम्हारी हँसी को देख कर मुझे खुशी मिलती है।",
      "तुम्हारी आँखों में मैं हर बार खो जाता हूँ।",
      "तुम्हारी मुस्कान से मेरा दिन बन जाता है।",
      "तुम्हारे साथ समय बिताना मुझे खुशी देता है।",
      "तुम्हारे साथ बात करते करते मेरी यह शाम बेहद खास हो गई है।",
      "तुम्हारी बातों में कुछ अलग सी मिठास है।",
      "तुम्हारे साथ बिताया हुआ हर पल यादगार होता है।",
      "तुम्हारी हर मुस्कान दिल को छू जाती है।",
      "तुम्हारी नजरों में उन ख्वाबों की खोज है जो मेरे दिल में छुपे हैं।",
      "तुम्हारी खूबसूरती के सामने मैं बस खड़ा हूँ और देखता हूँ।",
      "तुम्हारी आँखों का काजल, तुम्हारी होंठों का रंग, तुम्हारी हर चीज मुझे दीवाना बना देती है।",
      "तुम्हारे साथ हर लम्हा को जीने की ख्वाहिश है मुझे।",
      "तुम्हारे प्यार में मैं हमेशा खो जाता हूँ।",
      "तुम्हारे साथ हर सुबह एक नई शुरुआत होती है।",
      "तुम्हारी बातों में मेरी दिलचस्पी बढ़ गई है।",
      "तुम्हारे साथ मेरी जिंदगी रंगीन हो गई है।",
      "तुम्हारी हर खुशबू मेरे दिल को बहका देती है।",
      "तुम्हारे बिना मेरी जिंदगी अधूरी है।",
      "तुम्हारी मुस्कान मेरी धड़कनें तेज़ कर देती हैं।",
      "तुम्हारी हर बात मेरे दिल को बेहद प्रिय है।",
      "Your smile is like a summer vacation, everyone waits for it to start.",
      "Your lips are like a box of chocolates, opening them reveals sweetness.",
      "Your eyes are like rose petals, spreading fragrance to everyone around.",
      "Your lips are like sweet dates, everyone is ready to take a bite.",
      "Your eyes are like candy sprinkles, adding sweetness to every moment.",
      "Your laughter is like a candy store, everyone is eager to indulge.",
      "Your hands are like chocolate boxes, everyone loves to unwrap them.",
      "Your voice is like a love song, everyone wants to listen on repeat.",
      "Your presence is like sunshine, spreading warmth to everyone around.",
      "Your words are like a treasure trove, revealing sweet dreams to everyone.",
      "I appreciate the effort you put into your work every day.",
      "Your dedication to your goals is truly admirable.",
      "The way you handle challenges with grace and determination is inspiring.",
      "I'm impressed by your creativity and innovative ideas.",
      "Your kindness and generosity make the world a better place.",
      "I value your honesty and integrity in all situations.",
      "Your passion for learning and growth is commendable.",
      "I'm grateful for the positivity and joy you bring into my life.",
      "Your resilience in the face of adversity is remarkable.",
      "I admire your ability to stay calm and composed under pressure.",
      "Your attention to detail is exceptional and makes everything you do stand out.",
      "The way you always find a solution to every problem shows your resourcefulness.",
      "I admire your determination to overcome obstacles and achieve success.",
      "Your positive attitude is contagious and uplifts those around you.",
      "The passion you bring to your work inspires everyone to do their best.",
      "Your ability to see the best in people and situations is truly remarkable.",
      "I appreciate the care and thoughtfulness you put into everything you do.",
      "Your dedication to self-improvement and growth is inspiring to everyone around you.",
      "The empathy and understanding you show towards others is a rare and valuable trait.",
      "I'm grateful for the kindness and compassion you show to everyone you meet.",
    ];

    const pos = await Post.aggregate([
      { $match: { kind: "post" } },
      { $sample: { size: 1 } },
    ]);
    const use = await User.aggregate([
      { $match: { gr: 1 } },
      { $sample: { size: 1 } },
    ]);
    const comm = await Community.aggregate([{ $sample: { size: 1 } }]);

    let post = pos[0];
    let community = comm[0];
    let user = use[0];

    let inc = false;
    const isuser = await User.findById(community?.creator);
    if (isuser?.gr === 1) {
      inc = true;
    }

    const luck = Math.floor(Math.random() * 2);

    //stats
    let today = new Date();

    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    let formattedDate = `${day}/${month}/${year}`;

    const isOwner = community.creator.equals(user._id);
    const isSubscriber = community.members.includes(user._id);

    //checking if analytics for the day are there
    let analytcis = await Analytics.findOne({
      date: formattedDate,
      id: community._id,
    });

    if (!analytcis) {
      const ana = await Analytics({
        date: formattedDate,
        id: community._id,
      });
      await ana.save();
    }

    if (select[randomNumber].text === "view") {
      if (analytcis && post.views / analytcis.Y2 < 0.8) {
        await Post.updateOne({ _id: post._id }, { $inc: { views: 1 } });
      }
    } else if (select[randomNumber].text === "like") {
      if (post.likedby.includes(user._id)) {
        try {
          await Post.updateOne(
            { _id: post._id },
            { $pull: { likedby: user._id }, $inc: { likes: -1 } }
          );
          await User.updateOne(
            { _id: user._id },
            { $pull: { likedposts: post._id } }
          );
        } catch (e) {
          console.log("error liking 1");
        }
      } else {
        //likes will never be more than 60%
        if (post.likes / post.views < 1.6) {
          try {
            await Post.updateOne(
              { _id: post._id },
              { $addToSet: { likedby: user._id }, $inc: { likes: 1 } }
            );
            await User.updateOne(
              { _id: user._id },
              { $addToSet: { likedposts: post._id } }
            );
          } catch (e) {
            console.log("error liking 2");
          }
        }
      }
    } else if (select[randomNumber].text === "comment") {
      //comments will never be more than 30%
      if (post.totalcomments / post.views < 0.3) {
        const i = Math.floor(Math.random() * positiveComments.length);
        const newComment = new Comment({
          senderId: user._id,
          postId: post._id,
          text: positiveComments[i],
        });
        await newComment.save();
        await Post.updateOne(
          { _id: post._id },
          {
            $addToSet: { comments: newComment._id },
            $inc: { totalcomments: 1 },
          }
        );
      }
    } else if (select[randomNumber].text === "join") {
      if (inc || luck === 1) {
        if (isOwner) {
        } else if (isSubscriber) {
        } else if (community.type === "public") {
          let publictopic = [];
          for (let i = 0; i < community.topics.length; i++) {
            const topic = await Topic.findById({ _id: community.topics[i] });

            if (topic.type === "free") {
              publictopic.push(topic);
            }
          }

          let analytcis = await Analytics.findOne({
            date: formattedDate,
            id: community._id,
          });
          if (analytcis) {
            await Analytics.updateOne(
              { _id: analytcis._id },
              {
                $inc: {
                  Y1: 1,
                },
              }
            );
          } else {
            const an = new Analytics({
              date: formattedDate,
              id: community._id,
              Y1: 1,
            });
            await an.save();
          }

          const birthdateString = user.DOB;
          const birthdate = new Date(
            birthdateString.split("/").reverse().join("/")
          );

          const currentDate = new Date(); // Current date

          // Calculate age
          let age = currentDate.getFullYear() - birthdate.getFullYear();

          // Adjust age based on the birthdate and current date
          if (
            currentDate.getMonth() < birthdate.getMonth() ||
            (currentDate.getMonth() === birthdate.getMonth() &&
              currentDate.getDate() < birthdate.getDate())
          ) {
            age--;
          }

          // Update age range & Update gender
          if (user.gender === "Male") {
            if (age >= 18 && age <= 24) {
              await Community.updateOne(
                { _id: community._id },
                {
                  $inc: {
                    "demographics.gender.male": 1,
                    "demographics.age.18-24": 1,
                  },
                },
                {
                  new: true,
                }
              );
            } else if (age >= 25 && age <= 34) {
              await Community.updateOne(
                { _id: community._id },
                {
                  $inc: {
                    "demographics.gender.male": 1,
                    "demographics.age.25-34": 1,
                  },
                },
                {
                  new: true,
                }
              );
            } else if (age >= 35 && age <= 44) {
              await Community.updateOne(
                { _id: community._id },
                {
                  $inc: {
                    "demographics.gender.male": 1,
                    "demographics.age.35-44": 1,
                  },
                },
                {
                  new: true,
                }
              );
            } else if (age >= 45 && age <= 64) {
              await Community.updateOne(
                { _id: community._id },
                {
                  $inc: {
                    "demographics.gender.male": 1,
                    "demographics.age.45-64": 1,
                  },
                },
                {
                  new: true,
                }
              );
            } else if (age >= 65) {
              await Community.updateOne(
                { _id: community._id },
                {
                  $inc: {
                    "demographics.gender.male": 1,
                    "demographics.age.65+": 1,
                  },
                },
                {
                  new: true,
                }
              );
            }
          } else if (user.gender === "Female") {
            if (age >= 18 && age <= 24) {
              await Community.updateOne(
                { _id: community._id },
                {
                  $inc: {
                    "demographics.gender.female": 1,
                    "demographics.age.18-24": 1,
                  },
                },
                {
                  new: true,
                }
              );
            } else if (age >= 25 && age <= 34) {
              await Community.updateOne(
                { _id: community._id },
                {
                  $inc: {
                    "demographics.gender.female": 1,
                    "demographics.age.25-34": 1,
                  },
                },
                {
                  new: true,
                }
              );
            } else if (age >= 35 && age <= 44) {
              await Community.updateOne(
                { _id: community._id },
                {
                  $inc: {
                    "demographics.gender.female": 1,
                    "demographics.age.35-44": 1,
                  },
                },
                {
                  new: true,
                }
              );
            } else if (age >= 45 && age <= 64) {
              await Community.updateOne(
                { _id: community._id },
                {
                  $inc: {
                    "demographics.gender.female": 1,
                    "demographics.age.45-64": 1,
                  },
                },
                {
                  new: true,
                }
              );
            } else if (age >= 65) {
              await Community.updateOne(
                { _id: community._id },
                {
                  $inc: {
                    "demographics.gender.female": 1,
                    "demographics.age.65+": 1,
                  },
                },
                {
                  new: true,
                }
              );
            }
          }

          let address = user?.address?.state
            ?.toLocaleLowerCase()
            ?.toString()
            ?.trim();

          let com = await Community.findById(community._id);
          if (com.location[address]) {
            com.location[address]++;
          } else {
            com.location[address] = 1;
          }
          await com.save();

          //other updations
          let notif = { id: user._id, muted: false };

          await Community.updateOne(
            { _id: community._id },
            {
              $push: { members: user._id, notifications: notif },
              $inc: { memberscount: 1 },
            }
          );
          await User.updateOne(
            { _id: user._id },
            { $push: { communityjoined: community._id }, $inc: { totalcom: 1 } }
          );

          const topicIds = publictopic.map((topic) => topic._id);

          await Topic.updateMany(
            { _id: { $in: topicIds } },
            {
              $push: { members: user._id, notifications: notif },
              $inc: { memberscount: 1 },
            }
          );

          await User.updateMany(
            { _id: user._id },
            {
              $push: { topicsjoined: topicIds },
              $inc: { totaltopics: 2 },
            }
          );
        }
      }
    } else if (select[randomNumber].text === "unjoin") {
      if (community.memberscount > 0) {
        const mem = await User.findById();
        let publictopic = [];
        for (let i = 0; i < community.topics.length; i++) {
          const topic = await Topic.findById({ _id: community.topics[i] });
          if (topic.title === "Posts" || topic.title === "All") {
            publictopic.push(topic);
          }
        }

        if (isOwner) {
        } else if (!isSubscriber) {
        } else {
          await Community.updateOne(
            { _id: community._id },
            { $pull: { members: user._id }, $inc: { memberscount: -1 } }
          );
          await User.updateOne(
            { _id: user._id },
            {
              $pull: { communityjoined: community._id },
              $inc: { totalcom: -1 },
            }
          );

          await Community.updateOne(
            { _id: community._id },
            { $pull: { notifications: { id: user._id } } }
          );

          let analytcis = await Analytics.findOne({
            date: formattedDate,
            id: community._id,
          });
          if (analytcis) {
            await Analytics.updateOne(
              { _id: analytcis._id },
              {
                $inc: {
                  Y3: 1,
                },
              }
            );
          } else {
            const an = new Analytics({
              date: formattedDate,
              id: community._id,
              Y3: 1,
            });
            await an.save();
          }

          for (let i = 0; i < community.topics?.length; i++) {
            const topic = await Topic.findById(community.topics[i]);
            if (topic) {
              await Topic.updateOne(
                { _id: topic._id },
                {
                  $pull: { members: user._id, notifications: { id: user._id } },
                  $inc: { memberscount: -1 },
                }
              );
            }
            await User.updateMany(
              { _id: user._id },
              {
                $pull: { topicsjoined: topic._id },
                $inc: { totaltopics: -1 },
              }
            );
          }
        }
      }
    } else if (select[randomNumber].text === "share") {
      //share will never be more than 40%
      if (post.sharescount / post.views < 1.0) {
        await Post.updateOne({ _id: post._id }, { $inc: { sharescount: 1 } });
      }
    } else {
      //visits

      if (analytcis) {
        await Analytics.updateOne(
          { _id: analytcis._id },
          {
            $inc: {
              Y2: 1,
            },
          }
        );
      } else {
        const an = new Analytics({
          date: formattedDate,
          id: community._id,
          Y2: 1,
        });
        await an.save();
      }
    }

    console.log(
      post.title,
      community.title,
      user.fullname + " has - " + select[randomNumber].text
    );
  } catch (e) {
    console.log(e);
  }
};

//inc active
const incractive = async () => {
  try {
    const use = await User.aggregate([
      { $match: { gr: 1 } },
      { $sample: { size: 1 } },
    ]);
    //stats
    let today = new Date();

    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    let formattedDate = `${day}/${month}/${year}`;
    let user = use[0];

    //increasing active user
    const activity = await Admin.findOne({ date: formattedDate });
    if (activity) {
      //visitor count
      if (activity.users.includes(user._id)) {
        await Admin.updateOne(
          { _id: activity._id },
          {
            $addToSet: {
              returning: user._id,
            },
            $inc: {
              returningcount: 1,
            },
          }
        );
      } else {
        await Admin.updateOne(
          { _id: activity._id },
          {
            $addToSet: {
              users: user._id,
            },
            $inc: {
              activeuser: 1,
            },
          }
        );
      }
    } else {
      const a = new Admin({
        date: formattedDate,
        activeuser: 1,
        users: user._id,
      });
      await a.save();
    }
  } catch (e) {
    console.log(e);
  }
};

//inc returning
const incretur = async () => {
  try {
    const use = await User.aggregate([
      { $match: { gr: 1 } },
      { $sample: { size: 1 } },
    ]);
    //stats
    let today = new Date();

    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    let formattedDate = `${day}/${month}/${year}`;
    let user = use[0];

    //increasing active user
    const activity = await Admin.findOne({ date: formattedDate });
    if (activity) {
      //visitor count

      await Admin.updateOne(
        { _id: activity._id },
        {
          $addToSet: {
            returning: user._id,
          },
          $inc: {
            returningcount: 1,
          },
        }
      );
    } else {
      const a = new Admin({
        date: formattedDate,
        activeuser: 1,
        users: user._id,
      });
      await a.save();
    }
  } catch (e) {
    console.log(e);
  }
};

//ad stats
const adstat = async () => {
  try {
    const use = await User.aggregate([
      { $match: { gr: 1 } },
      { $sample: { size: 1 } },
    ]);

    const randomNumber = Math.floor(Math.random() * 2);
    let pos = await Post.aggregate([
      { $match: { kind: "ad" } },
      { $sample: { size: 1 } },
    ]);

    let userId = use[0]._id;

    let po = pos[0];

    let inside = randomNumber === 1 ? true : false;

    let imp = Math.floor(Math.random() * 2);
    let view = Math.floor(Math.random() * 2);
    let click = Math.floor(Math.random() * 2);

    try {
      const post = await Post.findById(po._id);
      if (post) {
        let today = new Date();

        let year = today.getFullYear();
        let month = String(today.getMonth() + 1).padStart(2, "0");
        let day = String(today.getDate()).padStart(2, "0");

        let formattedDate = `${day}/${month}/${year}`;

        const latestana = await Analytics.findOne({
          date: formattedDate,
          id: post.promoid,
        });

        const ad = await Ads.findById(post.promoid);
        const user = await User.findById(userId);
        const advertiser = await Advertiser.findById(ad.advertiserid);

        if (
          ad &&
          new Date(ad?.enddate) >= new Date() &&
          ad.status !== "stopped" &&
          advertiser
        ) {
          //calulating price
          function calculateAdRate(ad) {
            const costs = {
              gender: { male: 3, female: 2 },
              audience: {
                Sales: 9,
                Awareness: 5,
                Clicks: 10,
                Views: 4,
                Downloads: 8,
              },
              type: { banner: 3, skipable: 7, "non-skipable": 9, infeed: 5 },
            };

            let adRate = 0;

            if (ad && ad.type && costs.type.hasOwnProperty(ad.type)) {
              adRate += costs.type[ad.type];

              if (ad.gender && costs.gender.hasOwnProperty(ad.gender)) {
                adRate += costs.gender[ad.gender] || 5;
              }

              if (ad.audience && costs.audience.hasOwnProperty(ad.audience)) {
                adRate += costs.audience[ad.audience];
              }

              // if (ad.totalbudget) {
              //   adRate *= parseInt(ad.totalbudget);
              // }
            }

            return adRate;
          }

          const ad1 = {
            type: ad.type,
            gender: user?.gender,
            audience: ad.goal,
            totalbudget: ad?.totalbudget,
          };

          const adRate = calculateAdRate(ad1);

          if (
            parseInt(adRate) > parseInt(advertiser.currentbalance) ||
            parseInt(ad.totalbudget) < parseInt(ad.totalspent)
          ) {
            await Ads.updateOne(
              { _id: ad._id },
              { $set: { status: "stopped", stopreason: "Low Balance" } }
            );
            await Post.updateOne({ _id: post._id }, { $set: { kind: "post" } });
          } else {
            //updating ad stats
            await Ads.updateOne(
              { _id: ad._id },
              {
                $inc: {
                  totalspent: adRate,
                  views: view ? view : 0,
                  clicks: click ? click : 0,
                  impressions: imp ? imp : 0,
                  cpc: click / adRate || 0,
                },
              }
            );

            if (latestana) {
              await Analytics.updateOne(
                { _id: latestana._id },
                {
                  $inc: {
                    impressions: imp ? imp : 0,
                    views: view ? view : 0,
                    cpc: click / adRate || 0,
                    cost: adRate,
                    click: click ? click : 0,
                  },
                }
              );
            } else {
              const an = new Analytics({
                date: formattedDate,
                id: post.promoid,
                impressions: imp ? imp : 0,
                views: view ? view : 0,
                cpc: click / adRate || 0,
                cost: adRate,
                click: click ? click : 0,
              });
              await an.save();
            }
            console.log(adRate);
            //updating creator stats
            const com = await Community.findById(post.community);
            if (com) {
              if (com.ismonetized === true && inside) {
                //giving 90% to creator
                let moneytocreator = (adRate / 100) * 90;
                let moneytocompany = (adRate / 100) * 10;

                let earned = { how: "Ads", when: Date.now() };
                await User.updateOne(
                  { _id: com.creator },
                  {
                    $inc: { adsearning: moneytocreator },
                    $push: { earningtype: earned },
                  }
                );

                let earning = {
                  how: "Ads",
                  amount: moneytocompany,
                  when: Date.now(),
                  id: ad._id,
                };
                await Admin.updateOne(
                  { date: formattedDate },
                  {
                    $inc: { todayearning: moneytocompany },
                    $push: { earningtype: earning },
                  }
                );
              } else {
                let earning = {
                  how: "Ads",
                  amount: adRate,
                  when: Date.now(),
                  id: ad._id,
                };
                await Admin.updateOne(
                  { date: formattedDate },
                  {
                    $inc: { todayearning: adRate },
                    $push: { earningtype: earning },
                  }
                );
              }
            }

            let amtspt = {
              date: Date.now(),
              amount: adRate,
            };
            //deducting the amount from the advertiser
            await Advertiser.updateOne(
              { _id: ad.advertiserid },
              {
                $inc: { currentbalance: -adRate },
                $push: { amountspent: amtspt },
              }
            );
          }

          await Post.updateOne({ _id: post._id }, { $inc: { views: 1 } });
        }
      } else {
        console.log("error inc views");
      }
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
};

//scheduler (every 30 seconds)
cron.schedule("*/30 * * * * *", () => {
  console.log("Running");
  action();
});

//scheduler random mode
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//randomly scheduled
cron.schedule(`*/30 * * * * *`, () => {
  const randomDelay = getRandomInt(0, 30);
  setTimeout(() => {
    console.log(
      `Running active count with random delay of ${randomDelay} seconds`
    );
    incractive();
  }, randomDelay * 1000);
});

//17 minutes
cron.schedule(`*/17 * * * *`, () => {
  console.log("Returning", getRandomInt(0, 50));
  incretur();
});

//ad scheduler
cron.schedule(`*/30 * * * * *`, () => {
  const randomDelay = getRandomInt(0, 30);
  setTimeout(() => {
    console.log(`Running Ad - ${randomDelay} seconds`);
    adstat();
  }, randomDelay * 1000);
});

module.exports = router;
