import { ObjectId } from "mongodb";

type Channel = String;
type Tag = String;
type ChannelRecord = {
  channel: Channel;
  duration: number;
};
type Subscriber = {
  // _id: ObjectId;
  tag: Tag;
  data: {
    channels: Map<Channel, number>
    work_by_day: Map<String, ChannelRecord>
    total_duration: number
  };
};

function sameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() == d2.getMonth() &&
    d1.getDay() == d2.getDay()
  );
}

class SubscriberCollection {
  subscribers: Map<Tag, Subscriber>;

  constructor(subs: undefined | Array<Subscriber>) {
    this.subscribers = new Map<Tag, Subscriber>();
    if (subs) subs.forEach((x) => this.subscribers.set(x.tag, x));
    console.log(this.subscribers);
  }

  addSubscriber(tag : Tag): void {
    if (this.subscribers.has(tag)) return
    this.subscribers.set(tag, {
      tag: tag,
      data: {
        channels: new Map<Channel, number>(),
        work_by_day: new Map<String, ChannelRecord>(),
        total_duration: 0
      }
    });
  }

  removeSubscriber(tag : Tag): void {
    if (!this.subscribers.has(tag)) return
    this.subscribers.delete(tag);
  }

  subscribed?(tag : Tag) {
    return this.subscribers.has(tag);
  }

  update(user_tag: Tag, channel_name: Channel, duration: number) {
    if (!this.subscribers.has(user_tag)) return;
    let data = this.subscribers.get(user_tag).data;
    const today: String = new Date().toISOString().split("T")[0];
    data.channels.set(
      channel_name,
      (data.channels.get(channel_name) | 0) + duration
    );

    if (data.work_by_day.has(today))
      data.work_by_day.get(today).duration += duration;
    else
      data.work_by_day.set(today, {
        channel: channel_name,
        duration: duration,
      });
    data.total_duration += duration
  }
}

export { SubscriberCollection, Subscriber };
