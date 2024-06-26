import { action, computed, makeObservable, observable, toJS } from 'mobx';
import { IWorkspace } from './interfaces';

export type SimulatorNameType = 'desktop' | 'phone';

export type DesignerViewType = 'design' | 'code' | 'dual';

interface ISimulatorType {
  name: SimulatorNameType;
  width: number;
  height: number;
}

interface IViewportBounding {
  width: number;
  height: number;
}

interface IDesignerOptions {
  workspace: IWorkspace;
  simulator?: SimulatorNameType | ISimulatorType;
  activeSidebarPanel?: string;
}

const ISimulatorTypes: Record<string, ISimulatorType> = {
  desktop: {
    name: 'desktop',
    width: 1366,
    height: 800,
  },
  phone: {
    name: 'phone',
    width: 375,
    height: 812,
  },
};

export class Designer {
  /**
   * 当前的沙箱模拟器类型
   */
  _simulator: ISimulatorType = ISimulatorTypes.desktop;

  /**
   * 当前的视图尺寸
   */
  _viewport: IViewportBounding = {
    width: 1366,
    height: 800,
  };

  /**
   * 当前激活的视图
   */
  _activeView: DesignerViewType = 'design';

  /**
   * 当前选中的侧边栏面板
   */
  _activeSidebarPanel = '';

  /**
   * 是否显示智能引导
   */
  _showSmartWizard = false;

  /**
   * 是否显示右侧面板
   */
  _showRightPanel = true;

  /**
   * 是否预览模式
   */
  _isPreview = false;

  /**
   * 默认展开的侧边栏
   */
  defaultActiveSidebarPanel?: string;

  private readonly workspace: IWorkspace;

  get simulator(): ISimulatorType {
    return toJS(this._simulator);
  }

  get viewport() {
    return toJS(this._viewport);
  }

  get activeView() {
    return this._activeView;
  }

  get isPreview() {
    return this._isPreview;
  }

  get showSmartWizard() {
    return this._showSmartWizard;
  }

  get activeSidebarPanel() {
    return this._activeSidebarPanel;
  }

  get showRightPanel() {
    return this._showRightPanel;
  }

  constructor(options: IDesignerOptions) {
    this.workspace = options.workspace;

    const { simulator, activeSidebarPanel: defaultActiveSidebarPanel } = options;

    // 默认设计器模式
    if (simulator) {
      this.setSimulator(simulator);
    }

    // 默认展开的侧边栏
    if (defaultActiveSidebarPanel) {
      this.setActiveSidebarPanel(defaultActiveSidebarPanel);
    }

    makeObservable(this, {
      _simulator: observable,
      _viewport: observable,
      _activeView: observable,
      _activeSidebarPanel: observable,
      _showSmartWizard: observable,
      _showRightPanel: observable,
      _isPreview: observable,
      simulator: computed,
      viewport: computed,
      activeView: computed,
      activeSidebarPanel: computed,
      isPreview: computed,
      showRightPanel: computed,
      showSmartWizard: computed,
      setSimulator: action,
      setViewport: action,
      setActiveView: action,
      setActiveSidebarPanel: action,
      closeSidebarPanel: action,
      toggleRightPanel: action,
      toggleSmartWizard: action,
      toggleIsPreview: action,
    });
  }

  setSimulator(value: ISimulatorType | SimulatorNameType) {
    if (typeof value === 'string') {
      this._simulator = ISimulatorTypes[value];
    } else {
      this._simulator = value;
    }
  }

  setViewport(value: IViewportBounding) {
    this._viewport = value;
  }

  setActiveView(view: DesignerViewType) {
    this._activeView = view;
  }

  setActiveSidebarPanel(panel: string) {
    if (panel && panel !== this.activeSidebarPanel) {
      this._activeSidebarPanel = panel;
    } else {
      this._activeSidebarPanel = '';
    }
  }
  closeSidebarPanel() {
    this._activeSidebarPanel = '';
  }

  toggleSmartWizard(value: boolean) {
    this._showSmartWizard = value;
  }

  toggleRightPanel(value?: boolean) {
    this._showRightPanel = value ?? !this._showRightPanel;
  }

  toggleIsPreview(value: boolean) {
    this._isPreview = value ?? !this._isPreview;
    if (value) {
      this.workspace.selectSource.clear();
    }
  }
}
