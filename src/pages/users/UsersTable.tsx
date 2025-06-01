import type { ColumnDef } from '@tanstack/react-table';

import type { User } from '@/types';

import { useGetUsersQuery } from '@/api/hooks';
import { FIELDS_MAP } from '@/shared/constants';
import { isIsoDateString } from '@/shared/helpers/isIsoDateString';
import { DataTable } from '@/shared/ui/data-table';

export function UsersTable() {
  // const { ref, entry, inView } = useIntersectionObserver();

  // const userQuery = useInfiniteQuery({
  //   queryKey: [QUERY_KEY.USERS],
  //   queryFn: ({ pageParam = 1 }) => getUsers({
  //     config: {
  //      params: {
  //       _page: pageParam
  //      }
  //     }
  //   }),
  //   initialPageParam: 0,
  //   getPreviousPageParam: (firstPage) => firstPage.previousId,
  //   getNextPageParam: (lastPage) => lastPage.nextId,
  // });

  const userQuery = useGetUsersQuery();

  const dataKeys = [...new Set(userQuery.data?.data.flatMap((user) => Object.keys(user)))];

  const columns: ColumnDef<User>[] = dataKeys.map((key) => ({
    accessorKey: key,
    header: FIELDS_MAP[key as keyof User],
    cell: (info) => {
      const cell = info.cell.getValue();
      if (Array.isArray(cell)) {
        return cell.join(', ');
      }

      if (isIsoDateString(cell)) {
        const date = new Date(cell as string);
        return date.toLocaleDateString('ru-RU', {
          minute: 'numeric',
          hour: 'numeric'
        });
      }

      return cell;
    }
  }));

  return (
    <>
      {userQuery.isLoading && <div>Loading...</div>}
      <DataTable data={userQuery.data?.data || []} columns={columns} />
    </>
  );
}
