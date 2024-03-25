import React from 'react';
import configData from '../../config.json';
import '../../Css/privacypolicy.css';
import { Helmet } from 'react-helmet';

function PrivacyPolicy() {
  

  return (
    <div className='container'>
      <Helmet>
        <title>{`Privacy Policy | ${configData.Name}`}</title>
        <meta name="description" content="Discover KingsHeart's commitment to safeguarding your privacy. Our privacy policy outlines how we collect, use, and protect your personal information. Learn about your rights, data security measures, and how we strive to provide a secure and transparent online learning experience. Trust KingsHeart to prioritize your privacy as you embark on a journey to academic excellence." />
      </Helmet>
      <h1 className='header'>
        Privacy Policy
      </h1>
      <p>Effective Date: November 3, 2023</p>

      <h2 className='subheaderStyle'>1. Introduction</h2>
      <p>
        This Privacy Policy outlines how {configData.Name} ("we," "us," or "our") collects, uses, discloses, and safeguards personal information and data from users of our software. 
        We are committed to protecting your privacy and maintaining the security of your information.
      </p>

      <h2 className='subheaderStyle'>2. Information We Collect</h2>
      <p>
        <strong>User Account Information:</strong> To provide access to our software, we may collect personal information such as your email address, username, and password.
      </p>
      <p>
        <strong>Usage Data:</strong> We may collect information on how you interact with our app and blog, including your IP address, browser type, device type, pages viewed, and timestamps.
      </p>
      <p>
        <strong>User-Generated Content:</strong> Any information, comments, or content you submit to our blog, discussion forums, or other interactive areas are collected.
      </p>
      <p>
        <strong>Payment Information:</strong> If applicable, we collect payment details for purchases made through our app.
      </p>

      <h2 className='subheaderStyle'>3. How We Use Your Information</h2>
      <p>
        <strong>Provide Services:</strong> To deliver the functionalities of our software, questions, and updates to users.
      </p>
      <p>
        <strong>Personalization:</strong> To tailor content, questions, and updates based on your preferences and interactions with our platform.
      </p>
      <p>
        <strong>Communication:</strong> To send relevant notifications, updates, and announcements.
      </p>
      <p>
        <strong>Research and Analytics:</strong> To improve our services and understand user behavior.
      </p>
      <p>
        <strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights and interests.
      </p>

      <h2 className='subheaderStyle'>4. Sharing of Information</h2>
      <p>
        We do not share your personal information with third parties unless it is necessary for the operation of our services, for legal compliance, or with your consent.
      </p>
      <p>
        <strong>Third-Party Service Providers:</strong> We may use third-party services to help us operate our software, and they may have access to your information for these purposes.
      </p>
      <p>
        <strong>Legal Requirements:</strong> We may share your information to comply with legal obligations or respond to lawful requests from authorities.
      </p>

      <h2 className={'subheaderStyle'}>5. Security</h2>
      <p>
        We take data security seriously and employ reasonable measures to protect your information. However, no method of data transmission or storage is entirely secure, and we cannot guarantee absolute security.
      </p>

      <h2 className={'subheaderStyle'}>6. Your Choices</h2>
      <p>
        You have the right to access, correct, or delete your personal information, and you can do so through your account settings. You may also opt out of promotional communications at any time.
      </p>

      <h2 className={'subheaderStyle'}>7. Children's Privacy</h2>
      <p>
        Our app and blog are not intended for use by individuals under the age of 13. We do not knowingly collect information from children under 13.
      </p>

      <h2 className={'subheaderStyle'}>8. Updates to Privacy Policy</h2>
      <p>
        We may update this Privacy Policy to reflect changes in our practices. We will notify users of significant changes.
      </p>

      <h2 className={'subheaderStyle'}>9. Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at <a href={`mailto:${configData.ContactEmail}`}>{configData.ContactEmail}</a>.
      </p>
    </div>
  );
}

export default PrivacyPolicy;
