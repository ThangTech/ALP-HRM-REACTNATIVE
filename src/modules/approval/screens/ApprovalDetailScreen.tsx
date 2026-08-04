import React, { useEffect, useRef, useState } from 'react';
import { getTokens, ScrollView, View } from 'tamagui';
import {
  Button,
  DateTimePickerModal,
  Header,
  Input,
  OptionItem,
  OptionPickerModal,
  Screen,
  showToast,
  Text,
} from 'components';
import { IcCalendar, IcCheckbox, IcDropdown, IcTrash, IcUnCheckbox } from 'assets/svgs';
import { scale, verticalScale, horizontalScale } from 'utils';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import useDebounce from 'hooks/useDebounce';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, RouteName } from 'configs/navigation';
import UploadComponent from 'components/file-upload/UploadComponent';
import FileViewerItem from 'components/file-upload/FileViewerItem';
import { useUploadFile } from 'components/file-upload/useUploadFile';
import { goBack } from 'navigators';
import useApprovalDetail, {
  ACTION_LABELS,
  ACTION_VARIANTS,
  ApprovalApprover,
  ApprovalCategory,
  ApprovalUser,
} from '../hooks/useApprovalDetail';
import OptionPickerModal2 from 'components/base/OptionPickerModal2';

type Props = NativeStackScreenProps<
  AppStackParamList,
  RouteName.ApprovalDetail | RouteName.ApprovalCreate
>;

type FieldVisibility = 'optional' | 'required' | 'no';
const isVis = (v?: FieldVisibility) => v !== 'no' && v !== undefined;
const isReq = (v?: FieldVisibility) => v === 'required';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new: { bg: getTokens().color.d_grey.val, text: getTokens().color.white.val },
  pending: { bg: getTokens().color.l_yellow.val, text: getTokens().color.d_yellow.val },
  approved: { bg: getTokens().color.l_green.val, text: getTokens().color.forest.val },
  refused: { bg: getTokens().color.l_red.val, text: getTokens().color.d_red.val },
  cancel: { bg: getTokens().color.l_red.val, text: getTokens().color.d_red.val },
};
const DEFAULT_STATUS_COLOR = {
  bg: getTokens().color.d_grey.val,
  text: getTokens().color.white.val,
};

const APPROVER_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: getTokens().color.l_yellow.val, text: getTokens().color.d_yellow.val },
  approved: { bg: getTokens().color.l_green.val, text: getTokens().color.forest.val },
  refused: { bg: getTokens().color.l_red.val, text: getTokens().color.d_red.val },
  waiting: { bg: getTokens().color.silver.val, text: getTokens().color.grey.val },
};

const ApprovalDetailScreen = ({ route }: Props) => {
  const id = (route.params as any)?.id ?? 0;
  const isCreateMode = id === 0;

  const [partnerSearchText, setPartnerSearchText] = useState('');
  const debouncedPartnerSearch = useDebounce(partnerSearchText, 500);

  const [
    {
      detail,
      isLoading,
      categories,
      categoryOptions,
      users,
      userOptions,
      partnerOptions,
      refRequests,
      refRequestOptions,
      createLoading,
      submitLoading,
      updateLoading,
      actionLoading,
      uploadLoading,
    },
    { createApproval, submitApproval, updateApproval, performAction, uploadFiles, refetch },
  ] = useApprovalDetail(id, { partnerSearch: debouncedPartnerSearch });

  const uploadHook = useUploadFile();
  const { setUploadedFiles } = uploadHook;
  const isEditable = isCreateMode || detail?.request_status === 'new';

  const [selectedCategory, setSelectedCategory] = useState<ApprovalCategory | null>(null);
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [periodStart, setPeriodStart] = useState<Date | undefined>(undefined);
  const [periodEnd, setPeriodEnd] = useState<Date | undefined>(undefined);

  const [selectedPartner, setSelectedPartner] = useState<{ id: number; name: string } | null>(null);

  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reference, setReference] = useState('');
  const [location, setLocation] = useState('');
  const [selectedRefRequest, setSelectedRefRequest] = useState<{
    id: number;
    name: string;
    code?: string;
  } | null>(null);
  const [refundStatus, setRefundStatus] = useState('');
  const [selectedApprovers, setSelectedApprovers] = useState<
    (ApprovalUser & { required: boolean })[]
  >([]);

  // Track original values for diff on update (detail mode only)
  const originalRef = useRef<{
    name: string;
    reason: string;
    amount: string;
    categoryId?: number;
    date?: Date;
    periodStart?: Date;
    periodEnd?: Date;
    partnerId?: number;
    partner: string;
    product: string;
    quantity: string;
    reference: string;
    location: string;
    refRequestId?: number;
    refundStatus: string;
    approvers: (ApprovalUser & { required: boolean })[];
  } | null>(null);

  const categoryPickerRef = useRef<BottomSheet>(null);
  const refRequestPickerRef = useRef<BottomSheet>(null);
  const userPickerRef = useRef<BottomSheet>(null);
  const partnerPickerRef = useRef<BottomSheetModal>(null);
  const datePickerRef = useRef<BottomSheet>(null);
  const [datePickerConfig, setDatePickerConfig] = useState<{
    title: string;
    initialValue?: Date;
    onConfirm: (d: Date) => void;
  }>({ title: '', onConfirm: () => {} });

  // Pre-fill form when detail + categories load (detail mode only)
  useEffect(() => {
    if (isCreateMode || !detail || !categories) return;
    const cat = categories.find((c) => c.id === detail.category_id) ?? null;
    const cleanReason = detail.description?.replace(/<[^>]*>/g, '') || '';
    const parsedDate = detail.date ? new Date(detail.date) : undefined;
    const parsedStart = detail.date_start ? new Date(detail.date_start) : undefined;
    const parsedEnd = detail.date_end ? new Date(detail.date_end) : undefined;
    const amountStr = detail.amount ? detail.amount.toString() : '';
    const approvers = (detail.approver_ids || []).map((a) => ({
      id: a.user_id,
      name: a.user_name,
      required: a.required,
    }));
    const apiFiles = (detail.files || []).map((f) => ({
      id: f.attachment_id.toString(),
      name: f.name,
      type: (f.mimetype.startsWith('image/')
        ? 'image'
        : f.mimetype.startsWith('video/')
          ? 'video'
          : f.mimetype === 'application/pdf'
            ? 'pdf'
            : 'docx') as any,
      uri: f.download_url,
      size: f.file_size,
      isFromAPI: true,
    }));

    setSelectedCategory(cat);
    setName(detail.name || '');
    setReason(cleanReason);
    setAmount(amountStr);
    setDate(parsedDate);
    setPeriodStart(parsedStart);
    setPeriodEnd(parsedEnd);
    setLocation(detail.location || '');
    if (detail.partner_id && detail.partner_name) {
      setSelectedPartner({ id: detail.partner_id, name: detail.partner_name });
    } else if (detail.partner_name) {
      setSelectedPartner({ id: 0, name: detail.partner_name });
    } else {
      setSelectedPartner(null);
    }
    setProduct(detail.product || '');
    setQuantity(detail.quantity ? detail.quantity.toString() : '');
    if (detail.ref_request_id && detail.ref_request_name) {
      setSelectedRefRequest({ id: detail.ref_request_id, name: detail.ref_request_name });
    } else {
      setSelectedRefRequest(null);
    }
    setRefundStatus(detail.refund_status || '');
    setReference(detail.reference || '');
    setSelectedApprovers(approvers);
    setUploadedFiles(apiFiles);

    originalRef.current = {
      name: detail.name || '',
      reason: cleanReason,
      amount: amountStr,
      categoryId: detail.category_id,
      date: parsedDate,
      periodStart: parsedStart,
      periodEnd: parsedEnd,
      partnerId: detail.partner_id,
      partner: detail.partner_name || '',
      product: detail.product || '',
      quantity: detail.quantity ? detail.quantity.toString() : '',
      reference: detail.reference || '',
      location: detail.location || '',
      refRequestId: detail.ref_request_id,
      refundStatus: detail.refund_status || '',
      approvers,
    };
  }, [isCreateMode, detail, categories, setUploadedFiles]);

  const openDatePicker = (title: string, initialValue?: Date, onConfirm?: (d: Date) => void) => {
    setDatePickerConfig({ title, initialValue, onConfirm: onConfirm || (() => {}) });
    datePickerRef.current?.expand();
  };

  const handleSelectUser = (item: OptionItem) => {
    const user = (users || []).find((u) => u.id.toString() === item.key.toString());
    if (!user) return;
    if (selectedApprovers.some((a) => a.id === user.id)) {
      showToast('error', 'Người này đã được thêm vào danh sách phê duyệt');
      return;
    }
    setSelectedApprovers((prev) => [...prev, { ...user, required: false }]);
  };

  const handleToggleRequired = (userId: number) =>
    setSelectedApprovers((prev) =>
      prev.map((a) => (a.id === userId ? { ...a, required: !a.required } : a)),
    );

  const handleRemoveApprover = (userId: number) =>
    setSelectedApprovers((prev) => prev.filter((a) => a.id !== userId));

  const uploadNewFiles = async (): Promise<number[] | null | undefined> => {
    const newFiles = uploadHook.uploadedFiles.filter((f) => !f.isFromAPI);
    if (newFiles.length === 0) return [];

    const mapped = newFiles.map((f) => {
      let mimeType = 'application/octet-stream';
      if (f.type === 'image') mimeType = 'image/jpeg';
      else if (f.type === 'pdf') mimeType = 'application/pdf';
      else if (f.type === 'docx')
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      return { uri: f.uri, name: f.name, type: mimeType };
    });

    return uploadFiles({ files: mapped });
  };

  const validate = (showError = false): boolean => {
    const err = (msg: string) => {
      if (showError) showToast('error', msg);
      return false;
    };
    if (!selectedCategory) return err('Vui lòng chọn danh mục');
    if (!name.trim()) return err('Vui lòng nhập tiêu đề tờ trình');
    if (!reason.trim()) return err('Vui lòng nhập nội dung đề nghị');
    if (isReq(selectedCategory.has_amount) && !amount.trim()) return err('Vui lòng nhập số tiền');
    if (isReq(selectedCategory.has_date) && !date) return err('Vui lòng chọn ngày yêu cầu');
    if (isReq(selectedCategory.has_period) && (!periodStart || !periodEnd))
      return err('Vui lòng chọn giai đoạn áp dụng');
    if (isReq(selectedCategory.has_reference_request) && !selectedRefRequest)
      return err('Vui lòng chọn tờ trình tham chiếu');
    if (selectedApprovers.length === 0) return err('Vui lòng thêm ít nhất 1 người phê duyệt');
    if (isReq(selectedCategory.requirer_document) && uploadHook.uploadedFiles.length === 0)
      return err('Vui lòng đính kèm tài liệu');
    return true;
  };

  const handleCreate = async (shouldSubmit: boolean) => {
    if (!validate(true) || !selectedCategory) return;

    const attachmentIds = await uploadNewFiles();
    if (attachmentIds === null) return; // upload failed

    const approvers: ApprovalApprover[] = selectedApprovers.map((a) => ({
      user_id: a.id,
      required: a.required,
    }));
    const payload: any = {
      name: name.trim(),
      description: reason.trim(),
      category_id: selectedCategory.id,
      approvers,
      ...(attachmentIds &&
        attachmentIds.length > 0 && {
          documents: [{ name: 'Tài liệu đính kèm', attachment_ids: attachmentIds }],
        }),
    };

    if (isVis(selectedCategory.has_amount) && amount.trim())
      payload.amount = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;
    if (isVis(selectedCategory.has_date) && date) payload.date = dayjs(date).format('YYYY-MM-DD');
    if (isVis(selectedCategory.has_period) && periodStart)
      payload.date_start = dayjs(periodStart).format('YYYY-MM-DD');
    if (isVis(selectedCategory.has_period) && periodEnd)
      payload.date_end = dayjs(periodEnd).format('YYYY-MM-DD');
    if (isVis(selectedCategory.has_partner) && selectedPartner) {
      payload.partner_id = selectedPartner.id;
    }
    if (isVis(selectedCategory.has_product) && product.trim()) payload.product = product.trim();
    if (isVis(selectedCategory.has_quantity) && quantity.trim())
      payload.quantity = parseFloat(quantity) || 0;
    if (isVis(selectedCategory.has_reference) && reference.trim())
      payload.reference = reference.trim();
    if (isVis(selectedCategory.has_location) && location.trim()) payload.location = location.trim();
    if (isVis(selectedCategory.has_reference_request) && selectedRefRequest)
      payload.ref_request_id = selectedRefRequest.id;
    if (isVis(selectedCategory.has_refund_status) && refundStatus.trim())
      payload.refund_status = refundStatus.trim();

    const created = await createApproval(payload);
    if (!created) return;

    if (shouldSubmit) {
      const submitted = await submitApproval({ id: created.id });
      if (!submitted) return;
      showToast('success', 'Trình duyệt thành công');
    } else {
      showToast('success', 'Lưu phiếu thành công');
    }
    goBack();
  };

  const handleSubmitCreate = () => {
    Alert.alert('Xác nhận trình duyệt', 'Phiếu sẽ được gửi đi ngay sau khi tạo. Tiếp tục?', [
      { text: 'Không', style: 'cancel' },
      { text: 'Trình duyệt', onPress: () => handleCreate(true) },
    ]);
  };

  const handleUpdate = async () => {
    const orig = originalRef.current;
    const payload: any = { id };
    let hasChange = false;

    if (!orig || name.trim() !== orig.name) {
      payload.name = name.trim();
      hasChange = true;
    }
    if (!orig || reason.trim() !== orig.reason) {
      payload.description = reason.trim();
      hasChange = true;
    }
    if (!orig || selectedCategory?.id !== orig.categoryId) {
      payload.category_id = selectedCategory?.id;
      hasChange = true;
    }

    if (isVis(selectedCategory?.has_amount)) {
      const amtNum = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;
      if (amtNum !== (parseFloat(orig?.amount || '0') || 0)) {
        payload.amount = amtNum;
        hasChange = true;
      }
    }
    if (isVis(selectedCategory?.has_date) && date) {
      const fmt = dayjs(date).format('YYYY-MM-DD');
      if (fmt !== (orig?.date ? dayjs(orig.date).format('YYYY-MM-DD') : '')) {
        payload.date = fmt;
        hasChange = true;
      }
    }
    if (isVis(selectedCategory?.has_period)) {
      const s = periodStart ? dayjs(periodStart).format('YYYY-MM-DD') : '';
      const e = periodEnd ? dayjs(periodEnd).format('YYYY-MM-DD') : '';
      if (s !== (orig?.periodStart ? dayjs(orig.periodStart).format('YYYY-MM-DD') : '')) {
        payload.date_start = s;
        hasChange = true;
      }
      if (e !== (orig?.periodEnd ? dayjs(orig.periodEnd).format('YYYY-MM-DD') : '')) {
        payload.date_end = e;
        hasChange = true;
      }
    }
    if (isVis(selectedCategory?.has_location) && location.trim() !== (orig?.location || '')) {
      payload.location = location.trim();
      hasChange = true;
    }
    if (isVis(selectedCategory?.has_partner) && selectedPartner?.id !== orig?.partnerId) {
      payload.partner_id = selectedPartner?.id;
      hasChange = true;
    }
    if (isVis(selectedCategory?.has_product) && product.trim() !== (orig?.product || '')) {
      payload.product = product.trim();
      hasChange = true;
    }
    if (isVis(selectedCategory?.has_quantity) && quantity.trim() !== (orig?.quantity || '')) {
      payload.quantity = parseFloat(quantity) || 0;
      hasChange = true;
    }
    if (isVis(selectedCategory?.has_reference) && reference.trim() !== (orig?.reference || '')) {
      payload.reference = reference.trim();
      hasChange = true;
    }
    if (
      isVis(selectedCategory?.has_reference_request) &&
      selectedRefRequest?.id !== orig?.refRequestId
    ) {
      payload.ref_request_id = selectedRefRequest?.id;
      hasChange = true;
    }
    if (
      isVis(selectedCategory?.has_refund_status) &&
      refundStatus.trim() !== (orig?.refundStatus || '')
    ) {
      payload.refund_status = refundStatus.trim();
      hasChange = true;
    }

    const approversPayload: ApprovalApprover[] = selectedApprovers.map((a) => ({
      user_id: a.id,
      required: a.required,
    }));
    if (
      JSON.stringify(approversPayload) !==
      JSON.stringify((orig?.approvers || []).map((a) => ({ user_id: a.id, required: a.required })))
    ) {
      payload.approvers = approversPayload;
      hasChange = true;
    }

    const uploadedIds = await uploadNewFiles();
    if (uploadedIds === null) return; // upload failed
    if (uploadedIds && uploadedIds.length > 0) {
      payload.documents = [{ name: 'Tài liệu đính kèm', attachment_ids: uploadedIds }];
      hasChange = true;
    }

    if (!hasChange) {
      showToast('error', 'Không có thay đổi nào để cập nhật');
      return;
    }

    const result = await updateApproval(payload);
    if (!result) return;
    showToast('success', 'Cập nhật thành công');
    refetch();
  };

  const handleAction = (action: string) => {
    const label = ACTION_LABELS[action] || action;
    Alert.alert('Xác nhận', `Bạn có chắc muốn thực hiện "${label}"?`, [
      { text: 'Không', style: 'cancel' },
      {
        text: label,
        onPress: async () => {
          const result = await performAction({ action });
          if (!result) return;
          showToast('success', `${label} thành công`);
          refetch();
        },
      },
    ]);
  };

  const isProcessing =
    createLoading ||
    submitLoading ||
    updateLoading ||
    actionLoading ||
    uploadLoading ||
    uploadHook.isUploading;
  const statusColor = STATUS_COLORS[detail?.request_status ?? ''] ?? DEFAULT_STATUS_COLOR;
  const isValid = isCreateMode ? validate() : true;

  const renderApproversSection = () => (
    <View mt={verticalScale(16)}>
      {isEditable
        ? selectedApprovers.map((approver) => (
            <View
              key={approver.id}
              mb={verticalScale(10)}
              bg="$white"
              br={scale(10)}
              ph={horizontalScale(12)}
              pv={verticalScale(12)}
              borderWidth={1}
              borderColor="$border"
              style={styles.approverItem}
            >
              <View fd="row" ai="center" jc="space-between">
                <Text fontSize={scale(14)} fontWeight="600" color="$black">
                  {approver.name}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveApprover(approver.id)}
                  style={styles.iconBtn}
                >
                  <IcTrash size={scale(20)} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleToggleRequired(approver.id)}
              >
                <View fd="row" ai="center" jc="space-between" mt={verticalScale(8)}>
                  <Text fontSize={scale(12)} color="$grey">
                    Yêu cầu người này bắt buộc phê duyệt
                  </Text>
                  <View fd="row" ai="center" gap={horizontalScale(4)}>
                    {approver.required ? (
                      <IcCheckbox size={scale(20)} tintColor={getTokens().color.blue.val} />
                    ) : (
                      <IcUnCheckbox size={scale(20)} tintColor={getTokens().color.d_grey.val} />
                    )}
                    <Text fontSize={scale(12)} color="$grey">
                      Bắt buộc
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))
        : (detail?.approver_ids || []).map((approver) => {
            const sc = APPROVER_STATUS_COLORS[approver.status] ?? {
              bg: getTokens().color.silver.val,
              text: getTokens().color.grey.val,
            };
            return (
              <View
                key={approver.id}
                mb={verticalScale(10)}
                bg="$white"
                br={scale(10)}
                ph={horizontalScale(12)}
                pv={verticalScale(12)}
                borderWidth={1}
                borderColor="$border"
                style={styles.approverItem}
              >
                <View fd="row" ai="center" jc="space-between">
                  <View f={1}>
                    <Text fontSize={scale(14)} fontWeight="600" color="$black">
                      {approver.user_name}
                    </Text>
                    {approver.required && (
                      <Text fontSize={scale(12)} color="$grey" mt={verticalScale(2)}>
                        Bắt buộc phê duyệt
                      </Text>
                    )}
                  </View>
                  <View bg={sc.bg} br={scale(10)} ph={horizontalScale(10)} pv={verticalScale(4)}>
                    <Text fontSize={scale(12)} fontWeight="500" color={sc.text}>
                      {approver.status_label}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

      {isEditable && (
        <TouchableOpacity
          style={styles.addApproverBtn}
          activeOpacity={0.7}
          onPress={() => userPickerRef.current?.expand()}
        >
          <Text fontSize={scale(14)} color="$blue" fontWeight="500">
            Thêm người phê duyệt
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFilesSection = () => {
    if (!selectedCategory || !isVis(selectedCategory.requirer_document)) return null;

    if (!isEditable) {
      if (uploadHook.uploadedFiles.length === 0) return null;

      return (
        <View mt={verticalScale(12)} mb={verticalScale(24)}>
          <Text color="$black" fontSize={scale(16)} fontWeight="500" mb={verticalScale(16)}>
            Tài liệu đính kèm
          </Text>
          <View gap={scale(12)}>
            {uploadHook.uploadedFiles.map((file) => (
              <FileViewerItem key={file.id} file={file} disabled={true} />
            ))}
          </View>
        </View>
      );
    }

    return (
      <View mt={verticalScale(12)} mb={verticalScale(24)}>
        <View position="absolute" top={0} left={0} zIndex={2} pointerEvents="none">
          <Text color="$black" fontSize={scale(16)} fontWeight="500">
            Tài liệu đính kèm
            {isReq(selectedCategory?.requirer_document) && <Text color="$m_red"> *</Text>}
          </Text>
        </View>
        <UploadComponent hook={uploadHook} disabled={false} />
      </View>
    );
  };

  const renderBody = () => (
    <ScrollView f={1} showsVerticalScrollIndicator={false}>
      <TouchableOpacity activeOpacity={1}>
        <View ph={horizontalScale(16)} pt={verticalScale(16)} pb={verticalScale(32)}>
          {!isCreateMode && (
            <View mb={scale(18)}>
              <View fd="row" ai="center" jc="space-between" mb={verticalScale(16)}>
                <View
                  bg={statusColor.bg}
                  br={scale(20)}
                  ph={horizontalScale(14)}
                  pv={verticalScale(6)}
                >
                  <Text fontSize={scale(13)} fontWeight="600" color={statusColor.text}>
                    {detail?.request_status_label || ''}
                  </Text>
                </View>
              </View>

              <Text
                fontSize={scale(18)}
                fontWeight="700"
                textAlign="center"
                color="$black"
                mb={verticalScale(16)}
              >
                THÔNG TIN PHIẾU PHÊ DUYỆT
              </Text>

              <View gap={scale(18)}>
                <Input
                  label="Nhân viên"
                  editable={false}
                  value={
                    detail?.employee_name
                      ? `[${detail.employee_code}] ${detail.employee_name}`
                      : '--'
                  }
                />
                <Input label="Chức danh" editable={false} value={detail?.job_name || '--'} />
                <Input label="Phòng ban" editable={false} value={detail?.department_name || '--'} />
                <Input label="Công ty" editable={false} value={detail?.company_name || '--'} />
              </View>
            </View>
          )}

          <View gap={scale(18)}>
            <Input
              label="Danh mục"
              value={selectedCategory?.name || (!isCreateMode ? detail?.category_name : '') || ''}
              readOnly={!isEditable}
              isRequired={isEditable}
              placeholder={isCreateMode ? 'Chọn danh mục' : undefined}
              onPress={isEditable ? () => categoryPickerRef.current?.expand() : undefined}
              iconRight={isEditable ? <IcDropdown size={20} /> : undefined}
            />

            {isCreateMode && (
              <Input
                label="Công ty"
                editable={false}
                value={selectedCategory?.company_id ? selectedCategory.company_id.name : '---'}
              />
            )}

            {!isCreateMode && (
              <Input label="Mã tờ trình" editable={false} value={detail?.code || '--'} />
            )}

            <Input
              label="Tiêu đề tờ trình"
              placeholder="Nhập tiêu đề tờ trình"
              value={name}
              onChangeText={setName}
              readOnly={!isEditable}
              isRequired={isEditable}
            />

            {isVis(selectedCategory?.has_reference_request) && (
              <Input
                label="Tờ trình tham chiếu"
                placeholder={isCreateMode ? 'Chọn tờ trình tham chiếu' : undefined}
                value={
                  String(
                    selectedRefRequest
                      ? selectedRefRequest.code
                        ? `[${selectedRefRequest.code}] ${selectedRefRequest.name || ''}`
                        : selectedRefRequest.name || ''
                      : '',
                  ) || ''
                }
                readOnly={!isEditable}
                isRequired={isEditable && isReq(selectedCategory?.has_reference_request)}
                onPress={isEditable ? () => refRequestPickerRef.current?.expand() : undefined}
                iconRight={isEditable ? <IcDropdown size={20} /> : undefined}
              />
            )}

            <Input
              label={isCreateMode ? 'Nội dung đề nghị' : 'Nội dung'}
              placeholder="Nhập nội dung"
              value={reason}
              onChangeText={setReason}
              multiline
              style={styles.textarea}
              readOnly={!isEditable}
              isRequired={isEditable}
            />

            {isVis(selectedCategory?.has_amount) && (
              <Input
                label="Số tiền"
                placeholder="VND"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                readOnly={!isEditable}
                isRequired={isEditable && isReq(selectedCategory?.has_amount)}
              />
            )}

            {isVis(selectedCategory?.has_reference) && (
              <Input
                label="Tham chiếu"
                placeholder="Nhập nội dung tham chiếu"
                value={reference}
                onChangeText={setReference}
                readOnly={!isEditable}
                isRequired={isEditable && isReq(selectedCategory?.has_reference)}
              />
            )}

            {isVis(selectedCategory?.has_date) && (
              <Input
                label="Ngày yêu cầu"
                value={date ? dayjs(date).format('DD/MM/YYYY') : ''}
                readOnly={!isEditable}
                isRequired={isEditable && isReq(selectedCategory?.has_date)}
                onPress={
                  isEditable ? () => openDatePicker('Ngày yêu cầu', date, setDate) : undefined
                }
                iconRight={isEditable ? <IcCalendar size={18} /> : undefined}
              />
            )}

            {isVis(selectedCategory?.has_period) && (
              <View>
                <View fd="row" mb={verticalScale(6)}>
                  <Text fontSize={scale(16)} fontWeight="500" color="$black">
                    Giai đoạn áp dụng
                  </Text>
                  {isEditable && isReq(selectedCategory?.has_period) && (
                    <Text fontSize={scale(14)} color="$d_red" ml={horizontalScale(2)}>
                      *
                    </Text>
                  )}
                </View>
                <View fd="row" ai="center" gap={horizontalScale(8)}>
                  <View f={1}>
                    <Input
                      value={periodStart ? dayjs(periodStart).format('DD/MM/YYYY') : ''}
                      placeholder="Từ ngày"
                      readOnly={!isEditable}
                      onPress={
                        isEditable
                          ? () => openDatePicker('Từ ngày', periodStart, setPeriodStart)
                          : undefined
                      }
                      iconRight={isEditable ? <IcCalendar size={18} /> : undefined}
                    />
                  </View>
                  <Text color="$grey">→</Text>
                  <View f={1}>
                    <Input
                      value={periodEnd ? dayjs(periodEnd).format('DD/MM/YYYY') : ''}
                      placeholder="Đến ngày"
                      readOnly={!isEditable}
                      onPress={
                        isEditable
                          ? () => openDatePicker('Đến ngày', periodEnd, setPeriodEnd)
                          : undefined
                      }
                      iconRight={isEditable ? <IcCalendar size={18} /> : undefined}
                    />
                  </View>
                </View>
              </View>
            )}

            {isVis(selectedCategory?.has_location) && (
              <Input
                label="Vị trí"
                placeholder="Nhập vị trí"
                value={location}
                onChangeText={setLocation}
                readOnly={!isEditable}
                isRequired={isEditable && isReq(selectedCategory?.has_location)}
              />
            )}

            {isVis(selectedCategory?.has_partner) && (
              <Input
                label="Liên hệ"
                placeholder={isCreateMode ? 'Chọn thông tin liên hệ' : undefined}
                value={
                  selectedPartner
                    ? selectedPartner.name
                    : (!isEditable ? detail?.partner_name : '') || ''
                }
                readOnly={!isEditable}
                isRequired={isEditable && isReq(selectedCategory?.has_partner)}
                onPress={isEditable ? () => partnerPickerRef.current?.present() : undefined}
                iconRight={isEditable ? <IcDropdown size={20} /> : undefined}
              />
            )}

            {!isCreateMode && isVis(selectedCategory?.has_refund_status) && (
              <Input
                label="Trạng thái hoàn ứng"
                placeholder="Nhập trạng thái hoàn ứng"
                value={detail?.refund_status_label || ''}
                readOnly={true}
              />
            )}
          </View>

          {renderFilesSection()}
          {renderApproversSection()}
        </View>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderFooter = () => {
    if (isCreateMode) {
      return (
        <View
          fd="row"
          gap={scale(12)}
          ph={horizontalScale(16)}
          pt={verticalScale(12)}
          pb={verticalScale(32)}
          bg="$white"
          borderTopWidth={1}
          borderColor="$border"
          shadowColor={getTokens().color.black.val}
          shadowOffset={{ width: 0, height: -2 }}
          shadowOpacity={0.05}
          shadowRadius={4}
          style={{ elevation: 5 }}
        >
          <Button
            variant="detractive"
            style={styles.btn}
            onPress={() => handleCreate(false)}
            disabled={isProcessing}
          >
            <Button.Text variant="detractive">Lưu</Button.Text>
          </Button>
          <Button
            variant="secondary"
            style={styles.btn}
            onPress={handleSubmitCreate}
            loading={isProcessing}
            disabled={!isValid || isProcessing}
          >
            <Button.Text variant="secondary">Trình duyệt</Button.Text>
          </Button>
        </View>
      );
    }

    const buttons = detail?.buttons || [];
    if (!isEditable && buttons.length === 0) return null;

    return (
      <View
        p={horizontalScale(16)}
        pt={scale(16)}
        pb={scale(24)}
        bg="white"
        borderTopWidth={1}
        borderTopColor="#F1F3F5"
        shadowColor="#000"
        shadowOffset={{ width: 0, height: -2 }}
        shadowOpacity={0.05}
        shadowRadius={4}
        style={{ elevation: 5 }}
      >
        <View fd="row" gap={scale(12)}>
          {isEditable && (
            <Button
              variant="detractive"
              style={styles.btn}
              onPress={handleUpdate}
              disabled={isProcessing}
              loading={updateLoading}
            >
              <Button.Text variant="detractive">Cập nhật</Button.Text>
            </Button>
          )}
          {buttons.map((action) => (
            <Button
              key={action}
              variant={ACTION_VARIANTS[action] ?? 'secondary'}
              style={styles.btn}
              onPress={() => handleAction(action)}
              disabled={isProcessing}
            >
              <Button.Text variant={ACTION_VARIANTS[action] ?? 'secondary'}>
                {ACTION_LABELS[action] ?? action}
              </Button.Text>
            </Button>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Screen scrollEnabled={false}>
      <Header title={isCreateMode ? 'Tạo phiếu phê duyệt' : 'Chi tiết phiếu phê duyệt'} />
      {isLoading && !isCreateMode ? (
        <View f={1} ai="center" jc="center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          {renderBody()}
          {renderFooter()}
        </>
      )}

      <OptionPickerModal
        bottomSheetRef={categoryPickerRef}
        data={categoryOptions}
        selectedValue={selectedCategory?.id.toString()}
        title="Chọn danh mục"
        onSelect={(item) => {
          const cat = (categories || []).find((c) => c.id.toString() === item.key.toString());
          setSelectedCategory(cat || null);
          if (isCreateMode) {
            setAmount('');
            setDate(undefined);
            setPeriodStart(undefined);
            setPeriodEnd(undefined);
            setSelectedPartner(null);
            setProduct('');
            setQuantity('');
            setReference('');
            setLocation('');
            setSelectedRefRequest(null);
            setRefundStatus('');
          }
        }}
      />
      <OptionPickerModal
        bottomSheetRef={refRequestPickerRef}
        data={refRequestOptions}
        selectedValue={selectedRefRequest?.id ? selectedRefRequest.id.toString() : ''}
        title="Chọn tờ trình tham chiếu"
        onSelect={(item) => {
          const req = (refRequests || []).find((r) => r?.id?.toString() === item.key.toString());
          setSelectedRefRequest(req || null);
        }}
      />
      <OptionPickerModal
        bottomSheetRef={userPickerRef}
        data={userOptions}
        title="Chọn người phê duyệt"
        onSelect={handleSelectUser}
      />
      <OptionPickerModal2
        bottomSheetRef={partnerPickerRef}
        data={partnerOptions}
        selectedValue={selectedPartner?.id?.toString()}
        title="Chọn liên hệ"
        searchable={true}
        onSearchTextChange={setPartnerSearchText}
        onSelect={(item) => {
          setSelectedPartner({ id: Number(item.key), name: item.value });
        }}
      />
      <DateTimePickerModal
        bottomSheetRef={datePickerRef}
        mode="date"
        initialValue={datePickerConfig.initialValue}
        title={datePickerConfig.title}
        onConfirm={datePickerConfig.onConfirm}
      />

      {isProcessing && (
        <View
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0,0,0,0.3)"
          ai="center"
          jc="center"
          zIndex={1000}
        >
          <ActivityIndicator size="large" color={getTokens().color.white.val} />
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  textarea: {
    minHeight: verticalScale(100),
    textAlignVertical: 'top',
  },
  uploadContainer: {
    marginTop: verticalScale(20),
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: scale(12),
    paddingVertical: verticalScale(40),
    paddingHorizontal: horizontalScale(20),
    backgroundColor: '#F9FAFB',
  },
  uploadIconContainer: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filesListContainer: {
    marginTop: verticalScale(16),
    gap: scale(12),
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: scale(12),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    gap: scale(12),
  },
  deleteButton: {
    padding: scale(8),
  },
  approverItem: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  iconBtn: {
    padding: scale(8),
    backgroundColor: 'transparent',
  },
  addApproverBtn: {
    borderWidth: 1,
    borderColor: getTokens().color.blue.val,
    borderStyle: 'dashed',
    borderRadius: scale(8),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  btn: {
    flex: 1,
  },
});

export default ApprovalDetailScreen;
