import { Model, Q } from '@nozbe/watermelondb';
import {
  children,
  date,
  field,
  lazy,
  readonly,
  text,
} from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

// On the "parent" side (posts) you define an equivalent has_many association
// and pass the same column name (⚠️ note that the name here is foreignKey).

export class PostModel extends Model {
  static table = 'posts';
  static associations: Associations = {
    comments: { type: 'has_many', foreignKey: 'post_id' },
  };

  // User text fields. For fields that contain arbitrary text specified by the user (e.g. names, titles, comment bodies),
  // use @text - a simple extension of @field that also trims whitespace.
  @text('title') title;
  @text('body') body;
  @field('is_pinned') isPinned;
  // For date fields, use @date instead of @field. This will return a JavaScript Date object (instead of Unix timestamp integer).
  @date('last_event_at') lastEventAt;
  @date('archived_at') archivedAt;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  // Use ES6 getters to define model properties that can be calculated based on database fields:
  get isRecentlyArchived() {
    // in the last 7 days
    return (
      this.archivedAt &&
      this.archivedAt.getTime() > Date.now() - 7 * 24 * 3600 * 1000
    );
  }
  // To point to a list of records that belong to this Model, e.g. all Comments that belong to a Post, you can define a simple Query using @children:
  // Note: You must define a has_many association in static associations for this to work
  @children('comments') comments;

  // n addition to @children, you can define custom Queries or extend existing ones, for example:
  // @lazy verifiedComments = this.comments.extend(Q.where('is_verified', true));
}
