import { CatalogHeading } from './CatalogHeading';
import { useState } from 'react';
import { Flex, Typography } from 'antd';
import { AppButton, LocalIcon, LoginPanel, type LoginMethod, type LoginStage, type LoginValues } from '../index';
import refreshIconSvg from '../icons/svg/通用-刷新.svg?raw';

const { Text } = Typography;

const stageNames: Record<LoginStage, string> = {
  'before-input': '默认登录',
  'after-input': '已输入',
  'input-error': '输入错误',
  'account-abnormal': '账号异常',
  'forgot-password': '找回密码',
  'forgot-password-error-1': '找回密码·手机号错误',
  'forgot-password-error-2': '找回密码·验证码错误',
  'set-password': '设置密码',
};

/** 三条互斥的主流程；设置密码归属找回密码流程。 */
type LoginFlow = 'code' | 'password' | 'forgot';

interface FlowButton {
  key: string;
  label: string;
  flow: LoginFlow;
  stage: LoginStage;
  method: LoginMethod;
}

const flowButtons: FlowButton[] = [
  { key: 'code', label: '验证码登录', flow: 'code', stage: 'before-input', method: 'code' },
  { key: 'password', label: '密码登录', flow: 'password', stage: 'before-input', method: 'password' },
  { key: 'forgot', label: '找回密码', flow: 'forgot', stage: 'forgot-password', method: 'password' },
  { key: 'set-password', label: '设置密码', flow: 'forgot', stage: 'set-password', method: 'password' },
];

const flowNames: Record<LoginFlow, string> = {
  code: '验证码登录',
  password: '密码登录',
  forgot: '找回密码',
};

interface ErrorOption {
  stage: LoginStage;
  label: string;
  /** 账号异常是信息页而非报错，不使用危险色。 */
  danger: boolean;
}

/** 每条流程只暴露它真正能进入的异常状态，与上方流程联动。 */
const errorsByFlow: Record<LoginFlow, ErrorOption[]> = {
  code: [
    { stage: 'input-error', label: '输入报错', danger: true },
  ],
  password: [
    { stage: 'input-error', label: '输入报错', danger: true },
    { stage: 'account-abnormal', label: '账号异常页面', danger: false },
  ],
  forgot: [
    { stage: 'forgot-password-error-1', label: '手机号错误', danger: true },
    { stage: 'forgot-password-error-2', label: '验证码错误', danger: true },
  ],
};

function resolveFlow(method: LoginMethod, stage: LoginStage): LoginFlow {
  if (stage === 'forgot-password' || stage === 'forgot-password-error-1' || stage === 'forgot-password-error-2' || stage === 'set-password') {
    return 'forgot';
  }
  return method;
}

export function LoginShowcase() {
  const [method, setMethod] = useState<LoginMethod>('code');
  const [stage, setStage] = useState<LoginStage>('before-input');

  const activeFlow = resolveFlow(method, stage);

  const reset = (nextMethod: LoginMethod = method) => {
    setMethod(nextMethod);
    setStage('before-input');
  };

  const changeMethod = (nextMethod: LoginMethod) => reset(nextMethod);

  const submit = (values: LoginValues) => {
    if (stage.startsWith('forgot-password')) {
      setStage('set-password');
      return;
    }
    const credential = method === 'code' ? values.code : values.password;
    setStage(values.account && credential ? 'after-input' : 'input-error');
  };

  const enterFlow = (button: FlowButton) => {
    setMethod(button.method);
    setStage(button.stage);
  };

  const enterError = (target: LoginStage) => {
    // 输入报错沿用当前登录方式；账号异常 / 找回密码异常固定属于密码找回链路。
    if (target !== 'input-error') setMethod('password');
    setStage(target);
  };

  const errorOptions = errorsByFlow[activeFlow];
  const activeFlowKey = stage === 'set-password'
    ? 'set-password'
    : activeFlow === 'forgot'
      ? 'forgot'
      : activeFlow;

  return (
    <div className="login-showcase login-showcase--interactive">
      <article className="login-showcase__item">
        <CatalogHeading title={stageNames[stage]} />
        <LoginPanel
          method={method}
          stage={stage}
          onModeChange={changeMethod}
          onForgotPassword={() => setStage('forgot-password')}
          onBack={() => reset('password')}
          onSubmit={submit}
          onSkipSetPassword={() => reset('code')}
          onSetPassword={() => reset('password')}
          onConfirmAccountAbnormal={() => reset('password')}
        />
      </article>

      <aside className="login-showcase__controls" aria-label="登录组件状态控制">
        <div>
          <CatalogHeading title="状态切换" description="选择登录方式，再切换正常或异常状态。" />
        </div>

        <div className="login-showcase__control-group">
          <Text strong>登录流程</Text>
          <Flex wrap gap={8}>
            {flowButtons.map((button) => {
              const active = activeFlowKey === button.key;
              return (
                <AppButton
                  aria-pressed={active}
                  key={button.key}
                  type={active ? 'primary' : 'default'}
                  onClick={() => enterFlow(button)}
                >
                  {button.label}
                </AppButton>
              );
            })}
          </Flex>
        </div>

        <div className="login-showcase__control-group">
          <Text strong>异常状态 · {flowNames[activeFlow]}</Text>
          <Flex wrap gap={8}>
            {errorOptions.map((option) => {
              const active = stage === option.stage;
              return (
                <AppButton
                  aria-pressed={active}
                  danger={option.danger && active}
                  key={option.stage}
                  type={active ? 'primary' : 'default'}
                  onClick={() => enterError(option.stage)}
                >
                  {option.label}
                </AppButton>
              );
            })}
          </Flex>
        </div>

        <AppButton className="login-showcase__reset" icon={<LocalIcon svg={refreshIconSvg} />} onClick={() => reset('code')}>
          重置交互预览
        </AppButton>
      </aside>
    </div>
  );
}
