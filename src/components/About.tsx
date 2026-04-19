import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

const About = () => {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      setLoading(true);
      const data = await api.getAbout();
      setAboutData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <section
        id="about"
        className="py-24 px-6 bg-surface"
      >