import { FormEvent, useState } from 'react';
import { Globe, Mail, Share2, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../../../components/common/Logo';
import Button from '../../../components/common/Button';

function LandingFooter() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      return;
    }
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <footer className="landing-footer">
      <div className="landing-footer-grid">
        <div className="landing-footer-brand">
          <Logo />
          <p>
            The partner platform for audiobook publishers to manage, publish,
            and grow their catalog.
          </p>
          <p className="landing-footer-copy">
            &copy; {new Date().getFullYear()} Srota Partner. All rights reserved.
          </p>
        </div>

        <div className="landing-footer-links">
          <h3>Product</h3>
          <a href="#features">Features</a>
          <a href="#benefits">Benefits</a>
          <a href="#resources">Pricing</a>
        </div>

        <div className="landing-footer-links">
          <h3>Resources</h3>
          <a href="#resources">Help Center</a>
          <a href="#resources">Guides</a>
          <a href="#resources">API Docs</a>
        </div>

        <div className="landing-footer-links">
          <h3>Company</h3>
          <a href="#resources">About Us</a>
          <a href="#resources">Contact</a>
          <a href="#resources">Privacy Policy</a>
        </div>

        <div className="landing-footer-subscribe">
          <h3>Stay in the loop</h3>
          <p>Get product updates and partner tips in your inbox.</p>
          <form onSubmit={handleSubscribe} className="landing-subscribe-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Button type="submit">Subscribe</Button>
          </form>
          <div className="landing-footer-social">
            <a href="#resources" aria-label="Share">
              <Share2 size={18} />
            </a>
            <a href="#resources" aria-label="Website">
              <Globe size={18} />
            </a>
            <a href="#resources" aria-label="Video">
              <Video size={18} />
            </a>
            <a href="#resources" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
