import { faCheck, faCircleNotch, faSave, faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mount } from "enzyme";
import { afterEach, describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../test-utils/global.tests";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { IconBtn } from "../IconBtn/IconBtn";
import { IModalBtn, Modal, ModalBtnType } from "./Modal";

describe(__filename, () => {
  let { mountWrapper } = testGlobals;
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it("should animate entrance when rendered for the first time in 10ms", (done) => {
    Modal.resetLastClose();
    mountWrapper = mount(<Modal />);
    mountWrapper
      .find(Modal)
      .state()
      .shown.should.equal(false);
    setTimeout(() => {
      mountWrapper
        .find(Modal)
        .state()
        .shown.should.equal(true);
      done();
    }, 20);
  }).timeout(1000);

  it("should not animate entrance when rendered for the second time in 10ms", () => {
    Modal.resetLastClose();
    mountWrapper = mount(<Modal />);
    mountWrapper.unmount();
    mountWrapper = mount(<Modal />);
    mountWrapper
      .find(Modal)
      .state()
      .shown.should.equal(true);
  });

  it("should render children", () => {
    mountWrapper = mount(
      <Modal>
        <span id={"child1"} />
        <span id={"child2"} />
      </Modal>,
    );
    mountWrapper.find("#child1").should.have.lengthOf(1);
    mountWrapper.find("#child2").should.have.lengthOf(1);
  });

  it("should render a header if a title is given", () => {
    const headerClass = bs.modalHeader;
    mountWrapper = mount(<Modal title={"hello"} />);
    mountWrapper.find(`.${headerClass}`).should.have.lengthOf(1);
  });

  it("should not render a header if no title is given", () => {
    const headerClass = bs.modalHeader;
    mountWrapper = mount(<Modal />);
    mountWrapper.find(`.${headerClass}`).should.have.lengthOf(0);
  });

  it("should render a close button in the header", () => {
    const headerClass = bs.modalHeader;
    const closeClass = bs.modalHeader;
    mountWrapper = mount(<Modal title={"hello"} />);
    mountWrapper
      .find(`.${headerClass}`)
      .find(`.${closeClass}`)
      .should.have.lengthOf(1);
  });

  it("should render the title", () => {
    mountWrapper = mount(<Modal title={"hello"} />);
    mountWrapper.text().should.contain("hello");
  });

  it("should render a footer if buttons are given", () => {
    const footerClass = bs.modalFooter;
    const btn: IModalBtn = { type: ModalBtnType.CANCEL };
    mountWrapper = mount(<Modal buttons={[btn]} />);
    mountWrapper.find(`.${footerClass}`).should.have.lengthOf(1);
  });

  it("should not render a footer if no buttons are given", () => {
    const footerClass = bs.modalFooter;
    mountWrapper = mount(<Modal />);
    mountWrapper.find(`.${footerClass}`).should.have.lengthOf(0);
  });

  it("should render buttons if given", () => {
    const footerClass = bs.modalFooter;
    const btn1: IModalBtn = { type: ModalBtnType.CANCEL };
    const btn2: IModalBtn = { type: ModalBtnType.SAVE };
    mountWrapper = mount(<Modal buttons={[btn1]} />);
    mountWrapper
      .find(`.${footerClass}`)
      .find("button")
      .should.have.lengthOf(1);
    mountWrapper = mount(<Modal buttons={[btn1, btn2]} />);
    mountWrapper
      .find(`.${footerClass}`)
      .find("button")
      .should.have.lengthOf(2);
  });

  it("should render buttons correctly (cancel)", () => {
    const footerClass = bs.modalFooter;
    const btn: IModalBtn = { type: ModalBtnType.CANCEL };
    mountWrapper = mount(<Modal buttons={[btn]} />);
    const renderedBtn = mountWrapper.find(`.${footerClass}`).find(IconBtn);
    renderedBtn.props().icon.should.equal(faTimes);
    renderedBtn.text().should.equal("Cancel");
    renderedBtn
      .find("button")
      .props()
      .className.should.contain(bs.btnOutlineDark);
  });

  it("should render buttons correctly (save)", () => {
    const footerClass = bs.modalFooter;
    const btn: IModalBtn = { type: ModalBtnType.SAVE };
    mountWrapper = mount(<Modal buttons={[btn]} />);
    const renderedBtn = mountWrapper.find(`.${footerClass}`).find(IconBtn);
    renderedBtn.props().icon.should.equal(faSave);
    renderedBtn.text().should.equal("Save");
    renderedBtn
      .find("button")
      .props()
      .className.should.contain(bs.btnSuccess);
  });

  it("should render buttons correctly (ok)", () => {
    const footerClass = bs.modalFooter;
    const btn: IModalBtn = { type: ModalBtnType.OK };
    mountWrapper = mount(<Modal buttons={[btn]} />);
    const renderedBtn = mountWrapper.find(`.${footerClass}`).find(IconBtn);
    renderedBtn.props().icon.should.equal(faCheck);
    renderedBtn.text().should.equal("OK");
    renderedBtn
      .find("button")
      .props()
      .className.should.contain(bs.btnPrimary);
  });

  it("should disable buttons if requested", () => {
    const footerClass = bs.modalFooter;
    const btn: IModalBtn = { type: ModalBtnType.CANCEL, disabled: true };
    mountWrapper = mount(<Modal buttons={[btn]} />);
    mountWrapper
      .find(`.${footerClass}`)
      .find("button")
      .props()
      .disabled.should.equal(true);
  });

  it("should hide buttons if the modal is busy", () => {
    const footerClass = bs.modalFooter;
    const btn: IModalBtn = { type: ModalBtnType.CANCEL };
    mountWrapper = mount(<Modal buttons={[btn]} modalBusy={true} />);
    mountWrapper
      .find(`.${footerClass}`)
      .find("button")
      .should.have.lengthOf(0);
  });

  it("should render a spinner if the modal is busy and has a footer", () => {
    const footerClass = bs.modalFooter;
    const btn: IModalBtn = { type: ModalBtnType.CANCEL };
    mountWrapper = mount(<Modal buttons={[btn]} modalBusy={true} />);
    mountWrapper
      .find(`.${footerClass}`)
      .find(FontAwesomeIcon)
      .should.have.lengthOf(1);
    mountWrapper
      .find(`.${footerClass}`)
      .find(FontAwesomeIcon)
      .props()
      .icon.should.equal(faCircleNotch);
  });

  it("should call the close request listener when the close button is clicked", () => {
    const spy = sinon.spy();
    const headerClass = bs.modalHeader;
    mountWrapper = mount(<Modal title={"hello"} onCloseRequest={spy} />);
    mountWrapper
      .find(`.${headerClass}`)
      .find("button")
      .simulate("click");
    spy.calledOnce.should.equal(true);
  });

  it("should attach a document key listener on mount", () => {
    const spy = sinon.spy();
    sandbox.stub(document, "addEventListener").callsFake(spy);
    mountWrapper = mount(<Modal title={"hello"} />);
    spy.calledOnce.should.equal(true);
  });

  it("should remove the document key listener on unmount", () => {
    const spy = sinon.spy();
    sandbox.stub(document, "removeEventListener").callsFake(spy);
    mountWrapper = mount(<Modal title={"hello"} />);
    mountWrapper.unmount();
    spy.calledOnce.should.equal(true);
  });

  it("should clear the animation timeout on unmount", () => {
    const spy = sinon.spy();
    sandbox.stub(global, "clearTimeout").callsFake(spy);
    mountWrapper = mount(<Modal title={"hello"} />);
    mountWrapper.unmount();
    spy.calledOnce.should.equal(true);
  });

  it("should call the close request listener when the 'Esc' key is pressed", () => {
    const spy = sinon.spy();
    mountWrapper = mount(<Modal title={"hello"} onCloseRequest={spy} />);
    const evt = new KeyboardEvent("keydown", { key: "Esc" });
    document.dispatchEvent(evt);
    spy.calledOnce.should.equal(true);
  });

  it("should call the close request listener when the 'Escape' key is pressed", () => {
    const spy = sinon.spy();
    mountWrapper = mount(<Modal title={"hello"} onCloseRequest={spy} />);
    const evt = new KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(evt);
    spy.calledOnce.should.equal(true);
  });

  it("should not call the close request listener when a non-escape key is pressed", () => {
    const spy = sinon.spy();
    mountWrapper = mount(<Modal title={"hello"} onCloseRequest={spy} />);
    const evt = new KeyboardEvent("keydown", { key: "A" });
    document.dispatchEvent(evt);
    spy.called.should.equal(false);
  });

  it("should not call the close request listener when an already-cancelled 'Esc' key is pressed", () => {
    const spy = sinon.spy();
    mountWrapper = mount(<Modal title={"hello"} onCloseRequest={spy} />);
    const evt = new KeyboardEvent("keydown", { key: "Esc", cancelable: true });
    evt.preventDefault();
    document.dispatchEvent(evt);
    spy.called.should.equal(false);
  });

  it("should call button click listeners when they are clicked", () => {
    const spy = sinon.spy();
    const footerClass = bs.modalFooter;
    const btn: IModalBtn = { type: ModalBtnType.CANCEL, onClick: spy };
    mountWrapper = mount(<Modal buttons={[btn]} />);
    mountWrapper
      .find(`.${footerClass}`)
      .find("button")
      .simulate("click");
    spy.calledOnce.should.equal(true);
  });
});
