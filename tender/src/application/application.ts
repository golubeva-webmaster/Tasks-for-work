import Control from "../common/control";
import "./application.css";

export class Application extends Control {
  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", "", "<h1>info.companylist_by_set</h1><br>");
    this.startCycle();
  }

  startCycle() {
    const lobby = new Lobby(this.node);

    lobby.onPlayClick = () => {
      lobby.destroy();
      const gameScene = new GameScene(this.node);

      gameScene.onFinishClick = () => {
        gameScene.destroy();
        const victoryScene = new VictoryScene(this.node);
        victoryScene.onCloseClick = () => {
          victoryScene.destroy();
          this.startCycle();
        };
      };
    };
  }
}

export class Lobby extends Control {
  private playButton: Control<HTMLButtonElement>;
  public onPlayClick: () => void;
  registerButton: Control<HTMLButtonElement>;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", "", "Выберите настройки:<br>");
    // this.registerButton = new Control(this.node, "button", "", "register");
    // this.registerButton.node.onclick = () => {
    //   this.showRegisterPopup({
    //     name: "name",
    //     about: "about",
    //     gender: "M",
    //   }).then((result) => {
    //     if (result) {
    //       console.log(result);
    //     }
    //   });
    // };
    // this.playButton = new Control(this.node, "button", "", "play");
    // this.playButton.node.onclick = () => {
    //   this.onPlayClick();
    // };

    const selectForm = new SettingsForm(this.node);
    selectForm.setData({
      key: "6dea68e23416b21d201571d4c9263a57",
      setTypeId: "7",
      setId: "2",
      maxRows: "10",
      offset: "",
    });
    selectForm.onSelect = (data) => {
      console.log(data);
    };
  }

  showRegisterPopup(initialData: IUser): Promise<IUser> {
    return new Promise((resolve) => {
      const registerForm = new PopUp(this.node);
      registerForm.setData(initialData);
      registerForm.onOk = (data) => {
        registerForm.destroy();
        resolve(data);
      };
      registerForm.onCancel = () => {
        registerForm.destroy();
        resolve(null);
      };
    });
  }
}

export class GameScene extends Control {
  private finishButton: Control<HTMLElement>;
  public onFinishClick: () => void;
  private counterPanel: Control<HTMLElement>;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", "", "gameScene");
    this.finishButton = new Control(this.node, "button", "", "finish");
    this.counterPanel = new Control(this.node, "div", "", "0");

    this.finishButton.node.onclick = () => {
      this.animateCounter(() => this.onFinishClick());
    };
  }

  private animateCounter(onFinish: () => void) {
    let counter = 10;
    this.counterPanel.node.textContent = counter.toString();

    const animate = (calback: () => void) => {
      setTimeout(() => {
        counter--;
        this.counterPanel.node.textContent = counter.toString();
        if (counter > 0) {
          animate(calback);
        } else {
          calback();
          console.log("done");
        }
      }, 300);
    };

    const animateAsync = () => {
      return new Promise<void>((resolve, reject) => {
        animate(() => {
          resolve();
        });
      });
    };

    animateAsync().then(onFinish);
  }
}

export class VictoryScene extends Control {
  private closeButton: Control<HTMLButtonElement>;
  public onCloseClick: () => void;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", "", "win");
    this.closeButton = new Control(this.node, "button", "", "go to main menu");
    this.closeButton.node.onclick = () => {
      this.onCloseClick();
    };
  }
}

interface IUser {
  name: string;
  gender: "M" | "W";
  about: string;
}
export class PopUp extends Control {
  private okButton: Control<HTMLButtonElement>;
  private cancelButton: Control<HTMLButtonElement>;
  private keyInput: Control<HTMLInputElement>;
  private setTypeIdInput: Control<HTMLInputElement>;
  private genderInputW: Control<HTMLInputElement>;
  private aboutInput: Control<HTMLTextAreaElement>;
  public onOk: (data: IUser) => void;
  public onCancel: () => void;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", "", "win");
    this.keyInput = new Control(this.node, "input");
    this.setTypeIdInput = new Control(this.node, "input");
    this.setTypeIdInput.node.type = "radio";
    this.setTypeIdInput.node.name = "gemder";
    this.genderInputW = new Control(this.node, "input");
    this.genderInputW.node.type = "radio";
    this.genderInputW.node.name = "gemder";
    this.aboutInput = new Control(this.node, "textarea");
    this.okButton = new Control(this.node, "button", "", "ok");
    this.cancelButton = new Control(this.node, "button", "", "cancel");

    this.okButton.node.onclick = () => {
      this.onOk(this.getData());
    };

    this.cancelButton.node.onclick = () => {
      this.onCancel();
    };
  }

  public setData(data: IUser) {
    this.keyInput.node.value = data.name;
    this.aboutInput.node.value = data.about;
    if (data.gender == "M") {
      this.setTypeIdInput.node.checked = true;
    } else {
      this.genderInputW.node.checked = true;
    }
  }
  private getData() {
    const data: IUser = {
      name: this.keyInput.node.value,
      gender: this.genderInputW.node.checked ? "W" : "M",
      about: this.aboutInput.node.value,
    };
    return data;
  }
}
function showRegisterPopup() {
  throw new Error("Function not implemented.");
}
/////

interface ISelectData {
  key: string;
  setTypeId: string;
  setId: string;
  maxRows?: string;
  offset?: string;
}
export class SettingsForm extends Control {
  private selectButton: Control<HTMLButtonElement>;
  private clearButton: Control<HTMLButtonElement>;
  private keyLabel: Control<HTMLElement>;
  private keyInput: Control<HTMLInputElement>;
  private setTypeIdInput: Control<HTMLInputElement>;
  private setIdInput: Control<HTMLInputElement>;
  private maxRowsInput: Control<HTMLInputElement>;
  private offsetInput: Control<HTMLInputElement>;
  public onSelect: (data: ISelectData) => void;
  private onClear: () => void;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", "", "win");
    this.keyLabel = new Control(this.node, "label", "label", "key");
    this.keyInput = new Control(this.node, "input");
    this.setTypeIdInput = new Control(this.node, "input");
    this.setIdInput = new Control(this.node, "input");
    this.maxRowsInput = new Control(this.node, "input");
    this.offsetInput = new Control(this.node, "input");
    this.selectButton = new Control(this.node, "button", "", "select");
    this.clearButton = new Control(this.node, "button", "", "clear");

    this.selectButton.node.onclick = () => {
      this.onSelect(this.getData());
    };

    this.clearButton.node.onclick = () => {
      this.clearData();
    };
  }

  private clearData() {
    this.keyInput.node.value = "";
    this.setTypeIdInput.node.value = "";
    this.setIdInput.node.value = "";
    this.maxRowsInput.node.value = "";
    this.offsetInput.node.value = "";
  }

  public setData(data: ISelectData) {
    this.keyInput.node.value = data.key;
    this.setTypeIdInput.node.value = data.setTypeId;
    this.setIdInput.node.value = data.setId;
    this.maxRowsInput.node.value = data.maxRows;
    this.offsetInput.node.value = data.offset;
  }

  private getData() {
    const data: ISelectData = {
      key: this.keyInput.node.value,
      setTypeId: this.setTypeIdInput.node.value,
      setId: this.setIdInput.node.value,
      maxRows: this.maxRowsInput.node.value,
      offset: this.offsetInput.node.value,
    };
    return data;
  }
}
