import { Model } from '@nozbe/watermelondb';
import {
  field,
  immutableRelation,
  relation,
  writer,
} from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

// On the "child" side (comments) you define a belongs_to association,
// and pass a column name (key) that points to the parent (post_id is the ID of the post the comment belongs to).

export class CommentModel extends Model {
  static table = 'comments';
  static associations: Associations = {
    posts: { type: 'belongs_to', key: 'post_id' },
  };

  // To point to a related record, e.g. Post a Comment belongs to, or author (User) of a Comment, use @relation or @immutableRelation:
  @relation('posts', 'post_id') post;
  // @immutableRelation('users', 'author_id') author

  @field('is_spam') isSpam;

  @writer async markAsSpam() {
    await this.update((comment) => {
      comment.isSpam = true;
    });
  }
}
