// type Subjects = InferSubjects<typeof Article | typeof User> | 'all';

// export type AppAbility = Ability<[Action, Subjects]>;

// import { InferSubjects, Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability';
// import { Injectable, Module } from '@nestjs/common';
// //import { Action } from 'rxjs/internal/scheduler/Action';
// import { Article } from '../user/entities/article.entity';
// import { User } from 'src/user/entities/user.entity';
// import { Users } from '../user/entities/users.entity';
// import { Action } from '../user/enum/user.action.enum';

// @Module({})
// @Injectable()
// export class CaslModule {
//      createForUser(users: Users) {
//     const { can, cannot, build } = new AbilityBuilder<
//       Ability<[Action, Subjects]>
//     >(Ability as AbilityClass<AppAbility>);

//     if (users.isAdmin) {
//       can(Action.Manage, 'all');
//     } else {
//       can(Action.Read, 'all'); 
//     }

//     can(Action.Update, Article, { authorId: users.id });
//     cannot(Action.Delete, Article, { isPublished: true });

//     return build({
//       detectSubjectType: (item) =>
//         item.constructor as ExtractSubjectType<Subjects>,
//     });
  
// }
// }




