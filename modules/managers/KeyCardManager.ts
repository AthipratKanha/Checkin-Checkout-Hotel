import { KeyCard } from "../KeyCard";

export class KeyCardManager {
  private keyCards: KeyCard[];

  constructor(keycardCount: number) {
    this.keyCards = this.createKeyCards(keycardCount);
  }

  public get listKeyCard() {
    return this.keyCards;
  }

  public createKeyCards(keycardCount: number): KeyCard[] {
    return Array.from({ length: keycardCount }, (_, KeyCardindex) => {
      const KeyCardNo = KeyCardindex + 1;

      return new KeyCard(KeyCardNo);
    }).reverse();
  }

  public borrowKeyCard(): KeyCard | undefined {
    return this.keyCards.pop();
  }

  public returnKeyCard(keyCardNo: number) {
    return this.keyCards.push(new KeyCard(keyCardNo));
  }
}
