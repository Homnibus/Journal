from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework_guardian.filters import DjangoObjectPermissionsFilter

from rs_back_end.AuthorModelViewset import CreationModelViewSet
from rs_back_end.models import Information
from rs_back_end.guardian_permissions import FullObjectPermissions
from rs_back_end.serializers import InformationSerializer, InformationCreateSerializer


class InformationViewSet(CreationModelViewSet, ModelViewSet):
  """
  API Endpoint that allows information to be viewed or edited
  """
  queryset = Information.objects.all()
  serializer_class = InformationSerializer
  create_serializer_class = InformationCreateSerializer
  permission_classes = (FullObjectPermissions,)
  filter_backends = (DjangoObjectPermissionsFilter, DjangoFilterBackend,)
  filterset_fields = ('codex__slug',)
