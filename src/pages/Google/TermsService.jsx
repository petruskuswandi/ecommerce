import React from 'react';
import { Typography, Container, Box, Link, Divider, useTheme, useMediaQuery } from '@mui/material';

const TermsOfService = () => {
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
          Terms of Service
        </Typography>
        <Typography variant="subtitle1" paragraph align="center" color="textSecondary">
          Last updated: {new Date().toLocaleDateString()}
        </Typography>
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="body1" paragraph>
          Please read these Terms of Service carefully before using our service with Google OAuth integration.
        </Typography>

        <Section title="1. Acceptance of Terms">
          <Typography variant="body1" paragraph>
            By accessing or using our service, you agree to be bound by these Terms of Service and our Privacy Policy.
          </Typography>
        </Section>

        <Section title="2. Google OAuth Integration">
          <Typography variant="body1" paragraph>
            Our service uses Google OAuth for authentication. By using this feature, you agree to comply with Google's Terms of Service and Privacy Policy.
          </Typography>
        </Section>

        <Section title="3. User Responsibilities">
          <Typography variant="body1" paragraph>
            You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
          </Typography>
        </Section>

        <Section title="4. Prohibited Activities">
          <Typography variant="body1" paragraph>
            You agree not to:
          </Typography>
          <ListItem>Use the service for any illegal purpose</ListItem>
          <ListItem>Attempt to gain unauthorized access to our systems</ListItem>
          <ListItem>Interfere with or disrupt the service or servers</ListItem>
        </Section>

        <Section title="5. Intellectual Property">
          <Typography variant="body1" paragraph>
            All content and materials available through our service are the property of [Your Company Name] or its licensors and are protected by copyright, trademark, and other intellectual property laws.
          </Typography>
        </Section>

        <Section title="6. Limitation of Liability">
          <Typography variant="body1" paragraph>
            To the fullest extent permitted by law, [Your Company Name] shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
          </Typography>
        </Section>

        <Section title="7. Changes to Terms">
          <Typography variant="body1" paragraph>
            We reserve the right to modify these Terms of Service at any time. We will notify you of any changes by posting the new Terms of Service on this page.
          </Typography>
        </Section>

        <Section title="8. Governing Law">
          <Typography variant="body1" paragraph>
            These Terms of Service shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
          </Typography>
        </Section>

        <Section title="9. Contact Us">
          <Typography variant="body1" paragraph>
            If you have any questions about these Terms of Service, please contact us at <Link href="mailto:contact@example.com">contact@example.com</Link>.
          </Typography>
        </Section>
      </Box>
    </Container>
  );
};

export default TermsOfService;