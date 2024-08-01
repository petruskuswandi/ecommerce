import React from 'react';
import { Typography, Container, Box, Link, Divider, useTheme, useMediaQuery } from '@mui/material';

const PrivacyPolicy = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const Section = ({ title, children }) => (
    <Box mb={4}>
      <Typography variant={isSmallScreen ? "h6" : "h5"} component="h2" gutterBottom color="primary">
        {title}
      </Typography>
      {children}
    </Box>
  );

  const ListItem = ({ children }) => (
    <Box display="flex" alignItems="flex-start" mb={1}>
      <Typography variant="body1" component="span" mr={1}>•</Typography>
      <Typography variant="body1">{children}</Typography>
    </Box>
  );

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant={isSmallScreen ? "h4" : "h3"} component="h1" gutterBottom align="center" color="primary">
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" paragraph align="center" color="textSecondary">
          Last updated: {new Date().toLocaleDateString()}
        </Typography>
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="body1" paragraph>
          This Privacy Policy describes how we collect, use, and handle your information when you use our service with Google OAuth integration.
        </Typography>

        <Section title="Information We Collect">
          <Typography variant="body1" paragraph>
            When you sign in using Google OAuth, we may collect certain information from your Google account, including:
          </Typography>
          <ListItem>Your name</ListItem>
          <ListItem>Your email address</ListItem>
          <ListItem>Your profile picture</ListItem>
        </Section>

        <Section title="How We Use Your Information">
          <Typography variant="body1" paragraph>
            We use the information we collect to:
          </Typography>
          <ListItem>Provide, maintain, and improve our services</ListItem>
          <ListItem>Communicate with you about our services</ListItem>
          <ListItem>Protect against fraud and abuse</ListItem>
        </Section>

        <Section title="Data Sharing and Disclosure">
          <Typography variant="body1" paragraph>
            We do not sell your personal information. We may share your information in the following situations:
          </Typography>
          <ListItem>With your consent</ListItem>
          <ListItem>For legal reasons, if required by law</ListItem>
          <ListItem>To protect our rights, privacy, safety, or property</ListItem>
        </Section>

        <Section title="Your Rights">
          <Typography variant="body1" paragraph>
            You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at <Link href="mailto:contact@example.com">contact@example.com</Link>.
          </Typography>
        </Section>

        <Section title="Changes to This Policy">
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </Typography>
        </Section>

        <Section title="Contact Us">
          <Typography variant="body1" paragraph>
            If you have any questions about this Privacy Policy, please contact us at <Link href="mailto:contact@example.com">contact@example.com</Link>.
          </Typography>
        </Section>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;