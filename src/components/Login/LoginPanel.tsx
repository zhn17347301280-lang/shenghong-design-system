import { useState, type ReactNode } from 'react';
import { Button, Input, QRCode, Typography } from 'antd';
import { LocalIcon } from '../Icon/LocalIcon';
import backIconSvg from '../../icons/svg/通用-返回.svg?raw';
import warningIconSvg from '../../icons/svg/通用-感叹号提示.svg?raw';

const { Link, Text, Title } = Typography;

export type LoginMethod = 'password' | 'code';
export type LoginStage =
  | 'before-input'
  | 'after-input'
  | 'input-error'
  | 'account-abnormal'
  | 'forgot-password'
  | 'forgot-password-error-1'
  | 'forgot-password-error-2'
  | 'set-password';

export interface LoginValues {
  account: string;
  password?: string;
  code?: string;
}

export interface LoginPanelProps {
  /** MasterGo 属性：登陆方式。 */
  method?: LoginMethod;
  /** 兼容旧调用，等同于 method。 */
  mode?: LoginMethod;
  /** MasterGo 属性：登陆阶段。 */
  stage?: LoginStage;
  title?: ReactNode;
  account?: string;
  password?: string;
  code?: string;
  loading?: boolean;
  error?: ReactNode;
  onModeChange?: (mode: LoginMethod) => void;
  onSubmit?: (values: LoginValues) => void;
  onForgotPassword?: () => void;
  onBack?: () => void;
  onSkipSetPassword?: () => void;
  onSetPassword?: (password: string, confirmPassword: string) => void;
  onConfirmAccountAbnormal?: () => void;
  onProblem?: () => void;
  supportQrValue?: string;
}

function SupportQr({ value, compact = false }: { value: string; compact?: boolean }) {
  return (
    <div className={compact ? 'sh-login-support sh-login-support--compact' : 'sh-login-support'}>
      <QRCode bordered={false} className="sh-login-support__qr" size={compact ? 160 : 176} value={value} />
      {compact ? (
        <Text type="secondary">扫描二维码加入群聊</Text>
      ) : (
        <div className="sh-login-support__copy"><Text>登录遇到问题?</Text><Text>扫码联系客服</Text></div>
      )}
    </div>
  );
}

function stageHasValue(stage: LoginStage) {
  return stage === 'after-input' || stage === 'input-error' || stage === 'account-abnormal';
}

export function LoginPanel({
  method,
  mode,
  stage = 'before-input',
  title,
  account,
  password,
  code,
  loading,
  error,
  onModeChange,
  onSubmit,
  onForgotPassword,
  onBack,
  onSkipSetPassword,
  onSetPassword,
  onConfirmAccountAbnormal,
  onProblem,
  supportQrValue = 'https://work.weixin.qq.com/',
}: LoginPanelProps) {
  const initialMethod = method ?? mode ?? 'code';
  const [internalMethod, setInternalMethod] = useState<LoginMethod>(initialMethod);
  const activeMethod = method ?? mode ?? internalMethod;
  const [accountValue, setAccountValue] = useState(account ?? (stageHasValue(stage) ? '13800138000' : ''));
  const [passwordValue, setPasswordValue] = useState(password ?? (stageHasValue(stage) ? '12345678' : ''));
  const [codeValue, setCodeValue] = useState(code ?? (stageHasValue(stage) ? '123456' : ''));
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');

  const isForgot = stage.startsWith('forgot-password');
  const isSetPassword = stage === 'set-password';
  const isAccountAbnormal = stage === 'account-abnormal';
  const accountError = stage === 'input-error' || stage === 'forgot-password-error-1';
  const credentialError = stage === 'input-error' || stage === 'forgot-password-error-2';

  const changeMethod = (nextMethod: LoginMethod) => {
    if (method === undefined && mode === undefined) setInternalMethod(nextMethod);
    onModeChange?.(nextMethod);
  };

  const submit = () => onSubmit?.({ account: accountValue, password: passwordValue, code: codeValue });

  if (isAccountAbnormal) {
    return (
      <section className="sh-login-panel sh-login-panel--account-abnormal" data-method={activeMethod} data-stage={stage}>
        <div className="sh-login-panel__account-heading">
          <span className="sh-login-panel__warning"><LocalIcon svg={warningIconSvg} size={18} /></span>
          <div><Title level={3}>账号异常</Title><Text>该账号已被限制使用，如有疑问请联系客服</Text></div>
        </div>
        <SupportQr value={supportQrValue} />
        <Button className="sh-login-panel__account-confirm" type="primary" onClick={onConfirmAccountAbnormal}>确认</Button>
      </section>
    );
  }

  if (isSetPassword) {
    return (
      <section className="sh-login-panel" data-method="code" data-stage={stage}>
        <Title level={3} className="sh-login-panel__title">{title ?? '设置密码'}</Title>
        <div className="sh-login-panel__notice"><span>●</span><Text>首次登录，请先设置密码。</Text></div>
        <Input.Password size="large" placeholder="密码至少8位，含大小写字母和数字" value={newPasswordValue} onChange={(event) => setNewPasswordValue(event.target.value)} />
        <Input.Password size="large" placeholder="确认密码" value={confirmPasswordValue} onChange={(event) => setConfirmPasswordValue(event.target.value)} />
        <div className="sh-login-panel__split-actions">
          <Button size="large" onClick={onSkipSetPassword}>跳过</Button>
          <Button size="large" type="primary" onClick={() => onSetPassword?.(newPasswordValue, confirmPasswordValue)}>确定</Button>
        </div>
      </section>
    );
  }

  if (isForgot) {
    return (
      <section className="sh-login-panel" data-method="password" data-stage={stage}>
        <button className="sh-login-panel__back" type="button" aria-label="返回登录" onClick={onBack}>
          <LocalIcon svg={backIconSvg} size={18} />
        </button>
        <Title level={3} className="sh-login-panel__title">{title ?? '找回密码'}</Title>
        <div className="sh-login-panel__field">
          <Input size="large" status={accountError ? 'error' : undefined} placeholder="手机号码" value={accountValue} onChange={(event) => setAccountValue(event.target.value)} />
          {accountError && <Text className="sh-login-panel__field-error">请输入正确的手机号码</Text>}
        </div>
        <div className="sh-login-panel__field">
          <div className="sh-login-panel__code-row">
            <Input size="large" status={credentialError ? 'error' : undefined} placeholder="验证码" value={codeValue} onChange={(event) => setCodeValue(event.target.value)} />
            <Button size="large">获取验证码</Button>
          </div>
          {credentialError && <Text className="sh-login-panel__field-error">验证码错误，请重新输入</Text>}
        </div>
        <Text type="secondary" className="sh-login-panel__password-rule">密码至少8位，含大小写字母和数字</Text>
        <Input.Password size="large" placeholder="确认密码" value={passwordValue} onChange={(event) => setPasswordValue(event.target.value)} />
        <Button block size="large" type="primary" onClick={submit}>下一步</Button>
      </section>
    );
  }

  return (
    <section className="sh-login-panel" data-method={activeMethod} data-stage={stage}>
      <Title level={3} className="sh-login-panel__title">{title ?? '登录凌霄'}</Title>

      <div className="sh-login-panel__tabs" role="tablist" aria-label="登录方式">
        <button role="tab" aria-selected={activeMethod === 'code'} type="button" onClick={() => changeMethod('code')}>验证码登录</button>
        <button role="tab" aria-selected={activeMethod === 'password'} type="button" onClick={() => changeMethod('password')}>密码登录</button>
      </div>

      <div className="sh-login-panel__field">
        <Input
          size="large"
          status={accountError ? 'error' : undefined}
          placeholder={activeMethod === 'code' ? '请输入手机号码' : '手机号码'}
          value={accountValue}
          onChange={(event) => setAccountValue(event.target.value)}
        />
        {accountError && <Text className="sh-login-panel__field-error">请输入正确的手机号码</Text>}
      </div>

      {activeMethod === 'code' ? (
        <div className="sh-login-panel__field">
          <div className="sh-login-panel__code-row">
            <Input size="large" status={credentialError ? 'error' : undefined} placeholder="请输入验证码" value={codeValue} onChange={(event) => setCodeValue(event.target.value)} />
            <Button size="large">{stage === 'after-input' ? '60s' : '获取验证码'}</Button>
          </div>
          {credentialError && <Text className="sh-login-panel__field-error">验证码错误，请重新输入</Text>}
        </div>
      ) : (
        <div className="sh-login-panel__field">
          <Input.Password size="large" status={credentialError ? 'error' : undefined} placeholder="登录密码" value={passwordValue} onChange={(event) => setPasswordValue(event.target.value)} />
          {credentialError && <Text className="sh-login-panel__field-error">密码错误，请重新输入</Text>}
          <Link className="sh-login-panel__forgot" onClick={onForgotPassword}>忘记密码</Link>
        </div>
      )}

      {error && <div className="sh-login-panel__error">{error}</div>}
      <Button className="sh-login-panel__submit" block size="large" type="primary" loading={loading} onClick={submit}>
        {activeMethod === 'code' ? '登录/注册' : '登录'}
      </Button>
      <span className="sh-login-panel__problem-wrap">
        <Link className="sh-login-panel__problem" onClick={onProblem}>登录遇到问题?</Link>
        <span className="sh-login-panel__problem-popover" role="tooltip"><SupportQr compact value={supportQrValue} /></span>
      </span>
    </section>
  );
}
