import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation, useRouteMatch } from 'react-router-dom';

import { groupComposeModal } from '@/actions/compose.ts';
import { openModal } from '@/actions/modals.ts';
import { useGroupLookup } from '@/api/hooks/index.ts';
import Avatar from '@/components/ui/avatar.tsx';
import Button from '@/components/ui/button.tsx';
import HStack from '@/components/ui/hstack.tsx';
import { useAppDispatch } from '@/hooks/useAppDispatch.ts';

const ComposeButton = () => {
  const location = useLocation();
  const isOnGroupPage = location.pathname.startsWith('/group/');
  const match = useRouteMatch<{ groupSlug: string }>('/group/:groupSlug');
  const { entity: group } = useGroupLookup(match?.params.groupSlug || '');
  const isGroupMember = !!group?.relationship?.member;

  if (isOnGroupPage && isGroupMember) {
    return <GroupComposeButton />;
  }

  return <HomeComposeButton />;
};

/* const HomeComposeButton = () => {
  const dispatch = useAppDispatch();
  const onOpenCompose = () => dispatch(openModal('COMPOSE'));

  return (
    <Button
      theme='accent'
      size='lg'
      onClick={onOpenCompose}
      block
    >
      <FormattedMessage id='navigation.compose' defaultMessage='Stomp!' />
    </Button>
  );
}; */

const HomeComposeButton = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const onOpenCompose = () => dispatch(openModal('COMPOSE'));

  // Get the array of stomp variants from the locale file
  const stompVariants = useMemo(() => {
    const variants = intl.messages['compose.stomp_variants'];
    return Array.isArray(variants) && variants.length > 0
      ? variants
      : ['Stomp!']; // fallback if array is missing or empty
  }, [intl.messages]);

  // Pick one random variant (only re-rolls when locale changes or component remounts)
  const randomStomp = useMemo(() => {
    const idx = Math.floor(Math.random() * stompVariants.length);
    return stompVariants[idx] as string;
  }, [stompVariants]);

  return (
    <Button
      theme='accent'
      size='lg'
      onClick={onOpenCompose}
      block
    >
      {randomStomp}
    </Button>
  );
};

const GroupComposeButton = () => {
  const dispatch = useAppDispatch();
  const match = useRouteMatch<{ groupSlug: string }>('/group/:groupSlug');
  const { entity: group } = useGroupLookup(match?.params.groupSlug || '');

  if (!group) return null;

  const onOpenCompose = () => {
    dispatch(groupComposeModal(group));
  };

  return (
    <Button
      theme='accent'
      size='lg'
      onClick={onOpenCompose}
      block
    >
      <HStack space={3} alignItems='center'>
        <Avatar className='-my-1 border-2 border-white' size={30} src={group.avatar} />
        <span>
          <FormattedMessage id='navigation.compose_group' defaultMessage='Stomp in Group' />
        </span>
      </HStack>
    </Button>
  );
};

export default ComposeButton;
