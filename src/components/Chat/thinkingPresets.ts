import type { ThinkingStep } from './ThinkingProcess';
import intentIcon from '../../icons/svg/企业智能平台-用量管理-知识问答.svg?raw';
import planIcon from '../../icons/svg/通用-定时任务.svg?raw';
import knowledgeIcon from '../../icons/svg/凌霄侧边栏-我的知识库.svg?raw';
import webIcon from '../../icons/svg/凌霄侧边栏-全局搜索.svg?raw';
import dataIcon from '../../icons/svg/企业智能平台-用量管理-存储资源.svg?raw';
import skillIcon from '../../icons/svg/凌霄侧边栏-skill管理.svg?raw';
import toolIcon from '../../icons/svg/企业智能平台-OntoForge-逻辑建模-函数.svg?raw';
import externalIcon from '../../icons/svg/企业智能平台-用量管理-外部服务.svg?raw';
import analysisIcon from '../../icons/svg/数据报告-数据分析.svg?raw';
import fileIcon from '../../icons/svg/企业智能平台-用量管理-文件处理.svg?raw';
import repairIcon from '../../icons/svg/通用-刷新.svg?raw';

/** 供独立预览、完整对话页共用的思考与执行步骤及图标。 */
export const THINKING_DEMO_STEPS: ThinkingStep[] = [
  { key: 'intent', title: '意图理解', icon: intentIcon, description: '· 展示系统理解的任务目标、处理对象、关键约束和预期产物。' },
  { key: 'plan', title: '任务规划', icon: planIcon, description: '· 展示预期步骤、执行顺序及每一步的用户目标。' },
  { key: 'knowledge', title: '知识检索', icon: knowledgeIcon, description: '展示检索的知识库名称、检索范围、命中数量和主要覆盖内容。' },
  { key: 'web', title: '联网检索', icon: webIcon, description: '展示检索信息源名称、检索范围、命中数量和主要覆盖内容。' },
  { key: 'data', title: '数据查询', icon: dataIcon, description: '· 展示数据平台或数据集的用户友好名称。\n· 展示查询对象、时间范围、筛选条件和统计口径。\n· 展示返回记录数、数据截至时间、空值或缺失情况。' },
  { key: 'skill', title: '技能加载', icon: skillIcon, description: '· 展示技能的业务用途和处理对象，不展示内部函数名。\n· 展示执行结果、成功或失败项数，以及产生的业务对象。' },
  { key: 'tool', title: '工具调用', icon: toolIcon, description: '· 展示工具的业务用途和处理对象，不展示内部函数名。\n· 展示执行结果、成功或失败项数，以及产生的业务对象。' },
  { key: 'external', title: '外部系统执行', icon: externalIcon, description: '· 展示外部系统的业务用途和处理对象，不展示内部接口名。\n· 展示执行结果、成功或失败项数，以及产生的业务对象。' },
  { key: 'analysis', title: '运行、分析与计算', icon: analysisIcon, description: '· 展示分析对象、主要分析维度和采用的数据范围。\n· 展示关键中间结论或完成情况，但不复制最终答复全文。' },
  { key: 'file', title: '文件或成果生成', icon: fileIcon, description: '实际得到了什么；必要时补充数量、范围、来源和数据时间。' },
  { key: 'repair', title: '重新规划与自动修复', icon: repairIcon, description: '实际得到了什么；必要时补充数量、范围、来源和数据时间。' },
];
