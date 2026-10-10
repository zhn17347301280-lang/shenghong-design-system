import { useState } from 'react';
import { Alert, Button, Checkbox, Flex, Input, Radio, Select, Tag, Typography } from 'antd';

export type HITLDialogKind = 'multi-input' | 'radio' | 'radio-input' | 'input';
export type HITLDialogStage = 'before' | 'during' | 'after';
export type HITLFormStage = 'draft' | 'complete' | 'submitted';

const analysisItems = [
  'XXXXXXXXXXXXXX', 'XXXXXXXXXXXXXXXXXXXXXXXXXX', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  'XXXXXXXXXXXXXX', 'XXXXXXXXXXXXXXXXXXXXXXXXXX', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
];

export function HITLDialogConfirmation({ kind = 'radio-input', stage = 'before', count = 'single', onSubmit, onStop }: {
  kind?: HITLDialogKind;
  stage?: HITLDialogStage;
  count?: 'single' | 'multiple';
  onSubmit?: () => void;
  onStop?: () => void;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [radioValue, setRadioValue] = useState('需要调整');
  const [checks, setChecks] = useState<string[]>(['多选项一', '其他']);
  const [answer, setAnswer] = useState('');
  const showChoices = kind !== 'input';
  const showInput = kind !== 'radio';
  const isAfter = stage === 'after';
  const tabCount = count === 'single' ? 1 : 2;
  const submitDisabled = isAfter || (showChoices && kind === 'multi-input'
    ? checks.length === 0 || (showInput && !answer.trim())
    : !radioValue || (showInput && radioValue !== '无需调整' && !answer.trim())) || (!showChoices && !answer.trim());

  return (
    <article className={`sh-hitl-card ${showChoices && showInput ? 'sh-hitl-card--choices-input' : ''} ${isAfter ? 'is-disabled' : ''}`} aria-label="对话修改 HITL 卡片">
      <div className="sh-hitl-card__tabs" role="tablist" aria-label="待确认项">
        {['待确认项一', '待确认项二'].slice(0, tabCount).map((name, index) => <button key={name} type="button" role="tab" aria-selected={activeTab === index} className={activeTab === index ? 'is-active' : ''} disabled={isAfter} onClick={() => setActiveTab(index)}>{name}</button>)}
      </div>
      <div className="sh-hitl-card__content" role="tabpanel">
        <div className="sh-hitl-card__analysis"><p>分析维度如下：</p>{analysisItems.map((item, index) => <p key={`${activeTab}-${index}`}>· {item}</p>)}</div>
        {showChoices && <fieldset className="sh-hitl-card__choices" disabled={isAfter}>
          <legend>请确认分析维度是否需要调整？</legend>
          {kind === 'multi-input' ? <Flex vertical gap={4}>
            <Checkbox checked={checks.includes('多选项一')} onChange={(event) => setChecks((current) => event.target.checked ? [...current, '多选项一'] : current.filter((item) => item !== '多选项一'))}>多选项</Checkbox>
            <Checkbox checked={checks.includes('多选项二')} onChange={(event) => setChecks((current) => event.target.checked ? [...current, '多选项二'] : current.filter((item) => item !== '多选项二'))}>多选项</Checkbox>
            <Checkbox checked={checks.includes('其他')} onChange={(event) => setChecks((current) => event.target.checked ? [...current, '其他'] : current.filter((item) => item !== '其他'))}>其他</Checkbox>
          </Flex> : <Radio.Group className="sh-hitl-card__radio-group" value={radioValue} onChange={(event) => setRadioValue(event.target.value)} options={['无需调整', '需要调整', '其他'].map((label) => ({ label, value: label }))} />}
        </fieldset>}
        {showInput && <div className={`sh-hitl-card__input ${isAfter ? 'is-disabled' : ''}`}>
          {isAfter ? <div>{answer || '需要调整成xxxx'}</div> : <textarea aria-label="对话修改补充说明" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder={kind === 'input' ? '需要调整成xxxx' : '再次输入你的问题，我将进行跟进'} rows={1} />}
        </div>}
      </div>
      <div className="sh-hitl-card__footer">
        <div className="sh-hitl-card__footer-start">
          {count === 'multiple' && <><button type="button" className="sh-hitl-card__button" disabled={activeTab === 0 || isAfter} onClick={() => setActiveTab((current) => Math.max(0, current - 1))}>上一项</button><button type="button" className="sh-hitl-card__button" disabled={activeTab >= tabCount - 1 || isAfter} onClick={() => setActiveTab((current) => Math.min(tabCount - 1, current + 1))}>下一项</button></>}
          <button type="button" className="sh-hitl-card__button sh-hitl-card__button--primary" disabled={submitDisabled} onClick={onSubmit}>提交</button>
        </div>
        <button type="button" className="sh-hitl-card__button" disabled={isAfter} onClick={onStop}>停止任务</button>
      </div>
    </article>
  );
}

const formValues = {
  applicant: '张浩南', company: '江苏东方盛虹股份有限公司', department: '产品技术部', payee: '江苏东方盛虹',
  bank: '招商银行武汉东湖支行', account: '6214860271952646', title: '5月22日上海出差', amount: '¥631',
  process: '出差申请单(5月22日上海出差-CCSQD20260316007)', explanation: '报销说明xxxxxxxxxxxx',
};

export function HITLFormConfirmation({ stage = 'draft', onSubmit }: { stage?: HITLFormStage; onSubmit?: () => void }) {
  const editable = stage !== 'submitted';
  const complete = stage !== 'draft';
  const formFields = [
    { label: '申请人', key: 'applicant', value: formValues.applicant, editable: false },
    { label: '所属公司', key: 'company', value: formValues.company, editable: false },
    { label: '所属部门', key: 'department', value: formValues.department, editable: false },
    { label: '收款人', key: 'payee', value: formValues.payee, editable: true, placeholder: '请填写收款单位' },
    { label: '开户银行', key: 'bank', value: formValues.bank, editable: true, placeholder: '请填写开户银行' },
    { label: '银行账号', key: 'account', value: formValues.account, editable: true, placeholder: '请填写银行账号' },
    { label: '标题', key: 'title', value: formValues.title, editable: true, placeholder: '请填写出差申请标题' },
    { label: '报销总金额', key: 'amount', value: formValues.amount, editable: true, placeholder: '请填写报销总金额' },
  ];

  return (
    <article key={stage} className={`sh-hitl-form-card ${stage === 'submitted' ? 'is-submitted' : ''}`} aria-label="表单修改 HITL 卡片">
      <Typography.Title level={5}>差旅报销填报</Typography.Title>
      {stage === 'complete' && <Alert className="sh-hitl-form-card__alert" type="success" showIcon title="所有字段已填写完整，请确认信息后提交。" />}
      <div className="sh-hitl-form-card__fields">
        {formFields.map((field) => <div className={`sh-hitl-form-card__row ${field.editable ? 'is-editable' : ''}`} key={field.key}>
          <span className="sh-hitl-form-card__label"><i>*</i>{field.label}：</span>
          {field.editable && editable ? <Input size="middle" defaultValue={complete ? field.value : undefined} placeholder={field.placeholder} /> : <span className="sh-hitl-form-card__value">{field.value}</span>}
        </div>)}
        <div className="sh-hitl-form-card__row is-editable"><span className="sh-hitl-form-card__label"><i>*</i>相关流程：</span>{editable ? <Select placeholder="请选择相关流程" value={complete ? formValues.process : undefined} options={[{ value: formValues.process, label: formValues.process }]} /> : <span className="sh-hitl-form-card__value">{formValues.process}</span>}</div>
        <div className="sh-hitl-form-card__row sh-hitl-form-card__attachments"><span className="sh-hitl-form-card__label"><i>*</i>相关附件：</span>{complete ? <div className="sh-hitl-form-card__attachment-list"><div>{['携程订单发票.pdf', '酒店水单(订单尾号3365).pdf', '支付记录.jpg'].map((name) => <Tag key={name} closable={editable}>{name}</Tag>)}</div>{editable && <a>上传附件</a>}</div> : <a>上传附件</a>}</div>
        <div className="sh-hitl-form-card__row is-editable"><span className="sh-hitl-form-card__label">报销说明：</span>{editable ? <Input size="middle" defaultValue={complete ? formValues.explanation : undefined} placeholder="请填写出差报销说明" /> : <span className="sh-hitl-form-card__value">{formValues.explanation}</span>}</div>
      </div>
      <div className="sh-hitl-form-card__footer"><Button type="primary" disabled={stage !== 'complete'} onClick={onSubmit}>提交</Button></div>
    </article>
  );
}
