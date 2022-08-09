import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';

import AppleIcon from '../../../public/icons/apple.svg';
import FacebookIcon from '../../../public/icons/facebook.svg';
import GoogleIcon from '../../../public/icons/google.svg';

import styles from './login.module.scss';

import Button from 'src/components/dls/Button/Button';
import {
  makeGoogleLoginUrl,
  makeFacebookLoginUrl,
  makeAppleLoginUrl,
} from 'src/utils/auth/apiPaths';
import { logButtonClick } from 'src/utils/eventLogger';
import AuthType from 'types/auth/AuthType';

const SocialLogin = () => {
  const { t } = useTranslation('login');
  const logSocialLoginClick = (type: AuthType) => {
    // eslint-disable-next-line i18next/no-literal-string
    logButtonClick(`${type}_login`);
  };
  return (
    <>
      {process.env.NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN === 'true' && (
        <Button
          prefix={<GoogleIcon />}
          className={classNames(styles.loginButton, styles.googleButton)}
          href={makeGoogleLoginUrl()}
          shouldFlipOnRTL={false}
          onClick={() => {
            logSocialLoginClick(AuthType.Google);
          }}
        >
          {t('continue-google')}
        </Button>
      )}
      {process.env.NEXT_PUBLIC_ENABLE_FB_LOGIN === 'true' && (
        <Button
          prefix={<FacebookIcon />}
          className={classNames(styles.loginButton, styles.facebookButton)}
          href={makeFacebookLoginUrl()}
          shouldFlipOnRTL={false}
          onClick={() => {
            logSocialLoginClick(AuthType.Facebook);
          }}
        >
          {t('continue-facebook')}
        </Button>
      )}
      {process.env.NEXT_PUBLIC_ENABLE_APPLE_LOGIN === 'true' && (
        <Button
          href={makeAppleLoginUrl()}
          prefix={<AppleIcon />}
          className={styles.loginButton}
          shouldFlipOnRTL={false}
          onClick={() => {
            logSocialLoginClick(AuthType.Apple);
          }}
        >
          {t('continue-apple')}
        </Button>
      )}
    </>
  );
};

export default SocialLogin;
