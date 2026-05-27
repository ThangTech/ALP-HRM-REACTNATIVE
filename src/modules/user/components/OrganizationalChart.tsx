import { Text } from 'components';
import React from 'react';
import { StyleSheet } from 'react-native';
import { HOST } from 'react-native-dotenv';
import { View, Image } from 'tamagui';
import { horizontalScale, scale } from 'utils';

type RawApi = {
  data: {
    id: number;
    name: string;
    job_name: string;
    employee_code: string;
    image_url?: string;
    parents?:
      | {
          id: number;
          name: string;
          job_name: string;
          employee_code: string;
          image_url?: string;
        }[]
      | null;
    children?:
      | {
          id: number;
          name: string;
          job_name: string;
          employee_code: string;
          image_url?: string;
        }[]
      | null;
  };
};

type Props = {
  apiData?: RawApi | null; // <-- cho phép undefined hoặc null
  markCurrentUser?: boolean; // mặc định true: thêm "← Current User"
};

export default function OrganizationTreeCompact({ apiData }: Props) {
  // Safe destructuring với fallback values
  const { parents, children, name, job_name } = apiData?.data || {};
  const safeParents = parents || [];
  const safeChildren = children || [];

  // Early return nếu không có data
  if (!apiData?.data) {
    return (
      <View style={styles.wrap}>
        <Text>Không có dữ liệu tổ chức</Text>
      </View>
    );
  }

  const safeJob = (s?: string) => (s && s.trim().length ? `${s.trim()}` : '');

  return (
    <View style={styles.wrap} gap={scale(10)}>
      {/* Cha ông theo thứ tự mảng parents */}
      {safeParents.map((p, idx) => (
        <View key={`p-${p.id}`} style={{ marginLeft: idx * 14 }}>
          <View fd={'row'} ai={'center'}>
            <Image
              source={{ uri: `${HOST}${p.image_url}` }}
              width={horizontalScale(40)}
              height={horizontalScale(40)}
              br={scale(25)}
              borderWidth={1}
              borderColor={'$border'}
            />
            <View ml={horizontalScale(5)} gap={scale(3)}>
              <Text fontW={'bold'}>{p.name}</Text>
              <Text>{safeJob(p.job_name)}</Text>
            </View>
          </View>

          <Text ml={horizontalScale(12)}>└──</Text>
        </View>
      ))}

      {/* Chính mình */}
      <View style={{ marginLeft: safeParents.length * 18 }} gap={scale(10)}>
        <View fd={'row'} ai={'center'}>
          <Image
            source={{ uri: `${HOST}${apiData.data.image_url}` }}
            width={horizontalScale(40)}
            height={horizontalScale(40)}
            br={scale(25)}
            borderWidth={1}
            borderColor={'$border'}
          />
          <View ml={horizontalScale(5)} gap={scale(3)}>
            <Text fontW={'bold'}>{name} ←</Text>
            <Text>{safeJob(job_name)} </Text>
          </View>
        </View>

        {/* Con trực tiếp */}
        {safeChildren.map((c, i) => {
          const isLast = i === safeChildren.length - 1;
          return (
            <View key={`c-${c.id}`} fd={'row'} ai={'center'} gap={10} ml={horizontalScale(15)}>
              <Text>{isLast ? '└── ' : '├── '}</Text>
              <View fd={'row'} ai={'center'}>
                <Image
                  source={{ uri: `${HOST}${c.image_url}` }}
                  width={horizontalScale(40)}
                  height={horizontalScale(40)}
                  br={scale(25)}
                  borderWidth={1}
                  borderColor={'$border'}
                />
                <View ml={horizontalScale(5)} gap={scale(3)}>
                  <Text>{c.name}</Text>
                  <Text>{safeJob(c.job_name)}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: horizontalScale(15),
  },
});
